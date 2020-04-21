// feed structure:
//
// [postId]: {
//   title: string
//   text: string
//   coords: ?obj
//   location: ?string
//   likesNumber: number
//   isLiked: bool
//   uid: [postId]
//   key: [postId]
//   user: obj
//   timestamp: number
//   likes: ?obj {
//     [likeId]: {
//       userId: string
//     }
//   }
// }

import { observable, action, computed } from 'mobx'
import firebase from 'firebase/app'
import EntitiesStore from './entities-store'
import {
  PEOPLE_STORE,
  FEED_CHUNK_LENGTH,
  POSTS_REFERENCE,
  LIKES_REFERENCE,
  NAVIGATION_STORE,
  ATTACHMENTS_STORE,
  CURRENT_USER_STORE,
} from '../constants'
import loremIpsum from 'lorem-ipsum'
import * as Location from 'expo-location'
import { toJS } from 'mobx'
import withAttachments from './with-attachments'

// TODO move post form to new store?

@withAttachments()
class FeedStore extends EntitiesStore {
  @observable title = ''
  @observable text = ''
  @observable address = ''
  @observable attachedCoords = null
  @observable attachedLocation = ''
  @observable coords = null
  @observable lastPostKey = null

  @action setTitle = (title) => (this.title = title)
  @action setText = (text) => (this.text = text)
  @action setAddress = (address) => (this.address = address)
  @action setCoords = async (coords) => {
    this.coords = coords
    const [{ name, city, country }] = await Location.reverseGeocodeAsync({ ...coords })
    this.setAddress(name + (city ? ', ' + city : '') + (country ? ', ' + country : ''))
  }

  @action clearPostForm = () => {
    this.title = ''
    this.text = ''
    this.attachedCoords = null
    this.attachedLocation = ''
    this.coords = null
    this.address = ''
  }

  @action clearLocationForm = () => {
    this.coords = null
    this.address = ''
  }

  @action off = () => {
    this.clearPostForm()
    this.clear()
    this.lastPostKey = null
  }

  get reference() {
    return firebase.database().ref(POSTS_REFERENCE)
  }

  getLikesReference(postId) {
    return firebase.database().ref(POSTS_REFERENCE).child(postId).child(LIKES_REFERENCE)
  }

  @computed
  get posts() {
    return this.list.sort((a, b) => b.timestamp - a.timestamp)
  }

  @computed
  get lastPost() {
    return this.posts[this.size - 1]
  }

  // TODO:
  // @action fetchPosts = () => this.fetchEntities(
  //   () => this.reference.orderByKey(),
  //   this.appendFetchedPosts,
  //   FEED_CHUNK_LENGTH)

  @action fetchPosts = async () => {
    if (this.loaded || this.loading || !this.user) return

    console.log('FEED:', 'fetching posts started')
    this.loading = true

    const chunkShift = this.lastPostKey ? 1 : 0
    const chunkLength = FEED_CHUNK_LENGTH + chunkShift

    const callback = action(async (snapshot) => {
      const payload = snapshot.val() || {}

      const currentChunkLength = Object.keys(payload).length
      const isEmpty = currentChunkLength === chunkShift

      this.lastPostKey = Object.keys(payload)[0]

      !isEmpty && (await this.appendFetchedPosts(payload))

      this.loaded = isEmpty || currentChunkLength < chunkLength
      this.loading = false

      return true
    })

    let ref = this.reference.orderByKey().limitToLast(chunkLength)

    if (this.lastPostKey) {
      ref = ref.endAt(this.lastPostKey)
    }

    return await ref.once('value').then(callback)
  }

  cacheFeed = async () => {
    const posts = this.posts.slice(0, FEED_CHUNK_LENGTH).reduce((acc, post) => ({ ...acc, [post.uid]: toJS(post) }), {})

    return await this.cache(posts)
  }

  @action appendFetchedPosts = async (payload) => {
    const posts = await this.convertPosts(payload)

    this.entities = { ...this.entities, ...posts }
    await this.cacheFeed()
    return true
  }

  convertPosts = (payload) => {
    return Object.entries(payload).reduce(async (postsPromise, [key, post]) => {
      const posts = await postsPromise
      post = await this.convertPost(key, post)
      return { ...posts, [key]: post }
    }, Promise.resolve({}))

    // code with map and reduce:
    // const posts = await Promise.all(Object.entries(payload).map(([key, post]) => this.convertPost(key, post)))
    // return posts.reduce((acc, post) => ({...acc, [post.uid]: post}), {})
  }

  // This may be useful with orderBy firebase data
  convertPostFromPayload = async (payload) => Object.values(await this.convertPosts(payload))[0]

  convertPost = async (key, post) => {
    post.uid = key
    post.key = key

    // TODO: convert likes to array
    // if (post.likes) {}

    if (post.coords) {
      const [{ name, city, country }] = await Location.reverseGeocodeAsync({ ...post.coords })
      post.location = name + (city ? ', ' + city : '') + (country ? ', ' + country : '')
    }

    if (post.attachments) {
      post.attachments = await this.getStore(ATTACHMENTS_STORE).convertAttachments(post.attachments)
    }

    post.user = await this.getStore(PEOPLE_STORE).getUserLazily(post.userId)

    return post
  }

  @action appendPost = async (post) => {
    this.entities[post.uid] = post
    await this.cacheFeed()
    return this.entities[post.uid]
  }

  @action refreshPost = async (postId) => {
    const callback = async (snapshot) => {
      const payload = snapshot.val()
      const key = snapshot.key
      const post = await this.convertPost(key, payload)

      return await this.appendPost(post)
    }

    return await this.reference
      // .orderByKey()
      // .equalTo(postId)
      .child(postId)
      .once('value')
      .then(callback)
  }

  // fixme
  @action fetchPost = async (postId) => {
    const callback = (snapshot) => {
      const post = snapshot.val()
      const postId = snapshot.key

      const likes = Object.values(post.likes || {})

      post.uid = postId
      post.key = postId
      post.likesNumber = likes.length
      post.isLiked = likes.some((like) => like.userId === this.user.uid)

      return post
    }

    return await this.reference.child(postId).once('value').then(callback)
  }

  // fixme
  @action refreshFeed = () => {
    console.log('FEED:', 'refreshing')
    // TODO: this.size ?
    if (this.loading || !this.size) return

    this.loading = true
    const callback = action(async (snapshot) => {
      const payload = snapshot.val()

      if (!payload) {
        this.loading = false
        return
      }

      await this.appendFetchedPosts(payload)
      this.loading = false
    })

    // TODO: Something bad with this
    this.reference.orderByKey().startAt(this.lastPost.key).once('value', callback)
  }

  // TODO: stop fetching if aborted
  @action setLike = async (postId) => {
    const ref = this.getLikesReference(postId)

    if (this.entities[postId].likePending) return
    this.entities[postId].likePending = true

    if (this.isPostLiked(postId)) {
      delete this.entities[postId].likes.pending

      await Promise.all(
        Object.entries(this.entities[postId].likes).map(async ([key, like]) => {
          if (like.userId === this.user.uid) {
            delete this.entities[postId].likes[key]
            return await ref.child(key).remove()
          }
        })
      )
    } else {
      if (!this.entities[postId].likes) this.entities[postId].likes = {}
      this.entities[postId].likes.pending = { userId: this.user.uid }

      await ref.push({ userId: this.user.uid })
    }

    await this.refreshPost(postId)
  }

  getPost = (postId) => {
    return this.entities[postId]
  }

  @action attachLocation = () => {
    const { latitude, longitude } = this.coords
    this.attachedCoords = { latitude, longitude }
    this.attachedLocation = this.address
    this.getStore(NAVIGATION_STORE).goBack()
  }

  @action getCoordsFromAddress = async () => {
    if (!this.address) {
      alert('No address!')
      return
    }

    const [coords] = await Location.geocodeAsync(this.address)

    if (!coords) {
      alert('Nothing has been found!')
      return
    }

    await this.setCoords(coords)

    return coords
  }

  @action sendPost = async () => {
    if (!this.title || !this.text) {
      alert('No text or title!')
      return
    }

    const attachments = this.attachmentsToDb()

    const newPost = {
      title: this.title,
      text: this.text,
      userId: this.user.uid,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      coords: this.attachedCoords && {
        latitude: this.attachedCoords.latitude,
        longitude: this.attachedCoords.longitude,
      },
      attachments,
    }

    const { key } = await this.reference.push(newPost)
    // this.refreshFeed()
    this.refreshPost(key)
    this.getStore(NAVIGATION_STORE).goBack()
    this.clearPostForm()
    this.clearAttachments()
    this.clearLocationForm()
  }

  getPostLikesNumber = (postId) => {
    return Object.keys(this.entities[postId].likes || {}).length
  }

  isPostLiked = (postId) => {
    return Object.values(this.entities[postId].likes || {}).some(
      (like) => like.userId === this.getStore(CURRENT_USER_STORE).currentUserId
    )
  }

  getPostLikes = async (postId) => {
    const { likes } = this.entities[postId]
    const people = this.getStore(PEOPLE_STORE)

    return Promise.all(
      Object.entries(likes).map(async ([key, { userId }]) => {
        const user = await people.getUserGreedily(userId)
        return { userId, user, key }
      })
    )
  }

  getUserLikedPosts = async (uid) => {
    const callback = (snapshot) =>
      Object.entries(snapshot.val() || {}).reduce(
        (acc, [postId, { likes, title }]) =>
          likes && Object.values(likes).some(({ userId }) => userId === uid) ? [...acc, { postId, title }] : acc,
        []
      )

    return await this.reference.orderByChild(LIKES_REFERENCE).limitToLast(10).once('value').then(callback)
  }

  getUserPosts = async (uid) => {
    const callback = (snapshot) =>
      Object.entries(snapshot.val() || {}).map(([postId, { title }]) => ({ postId, title }))

    return await this.reference.orderByChild('userId').equalTo(uid).limitToLast(10).once('value').then(callback)
  }

  // DEPRECATED CODE

  @action subscribeOnLikes = (postId) => {
    const callback = action((snapshot) => {
      const payload = snapshot.val()
      const likes = Object.values(payload || {})
      const post = this.entities[postId]

      post.likes = payload
      post.likesNumber = likes.length
      post.isLiked = likes.some((like) => like.userId === this.user.uid)

      // this.appendLikes(payload, post)
    })

    this.getLikesReference(postId).on('value', callback)
  }

  postsToFb = async () => {
    const users = await firebase
      .database()
      .ref('people')
      .once('value')
      .then((snapshot) => Object.keys(snapshot.val()))
    console.log(users)

    const feedFixtures = Array.from({ length: 50 }, (_, i) => ({
      title: i + ' ' + loremIpsum({ count: Math.random() * 8, units: 'words' }).replace(/\w/, (x) => x.toUpperCase()),
      text: loremIpsum({ count: Math.random() * 20, units: 'sentences' }),
      // comments: [],
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      userId: users[Math.round(Math.random() * (users.length - 1))],
      coords: Math.round(Math.random())
        ? {
            latitude: Math.random() * 20 + 40,
            longitude: Math.random() * 20,
          }
        : null,
      // likes: Array.from({length: Math.round(Math.random() * 200)}, (_, i) => ({uid: 'uid'}))
    }))

    feedFixtures.forEach((post) => {
      const ref = this.reference.push(post)
      users.forEach((userId) => Math.round(Math.random()) && this.getLikesReference(ref.key).push({ userId }))
    })
  }
}

export default FeedStore
