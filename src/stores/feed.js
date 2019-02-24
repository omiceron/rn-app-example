import {observable, action, computed, observe} from 'mobx'
import firebase from 'firebase/app'
import EntitiesStore from './entities-store'
import {
  PEOPLE_STORE,
  FEED_CHUNK_LENGTH,
  POSTS_REFERENCE,
  LIKES_REFERENCE,
  NAVIGATION_STORE
} from '../constants'
import loremIpsum from 'lorem-ipsum'
import {Location} from 'expo'
import {entitiesFromFB} from './utils'

class FeedStore extends EntitiesStore {

  @observable title = ''
  @observable text = ''
  @observable address = ''
  @observable attachedCoords = null
  @observable coords = null
  @observable lastPostKey = null

  @action setTitle = title => this.title = title
  @action setText = text => this.text = text
  @action setAddress = address => this.address = address
  @action setCoords = async (coords) => {
    this.coords = coords
    const [{name, city, country}] = await Location.reverseGeocodeAsync({...coords})
    this.setAddress(name + (city ? ', ' + city : '') + (country ? ', ' + country : ''))
  }

  @action clearPostForm = () => {
    this.title = ''
    this.text = ''
    this.attachedCoords = null
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
    return firebase.database()
      .ref(POSTS_REFERENCE)
  }

  getLikesReference(postId) {
    return firebase.database()
      .ref(POSTS_REFERENCE)
      .child(postId)
      .child(LIKES_REFERENCE)
  }

  @computed
  get posts() {
    return this.list.sort((a, b) => b.timestamp - a.timestamp)
  }

  @computed
  get lastPost() {
    return this.posts[this.size - 1]
  }

  @action fetchPosts = async () => {
    console.log('FEED:', 'fetching posts started')

    if (this.loaded || this.loading) return

    this.loading = true

    const chunkShift = this.lastPostKey ? 1 : 0
    const chunkLength = FEED_CHUNK_LENGTH + chunkShift

    const callback = action(async (snapshot) => {
      const payload = snapshot.val() || {}

      this.lastPostKey = Object.keys(payload)[0]
      const currentChunkLength = Object.keys(payload).length
      const isEmpty = currentChunkLength === chunkShift

      !isEmpty && await this.appendFetchedPosts(payload)

      this.loaded = isEmpty || currentChunkLength < chunkLength
      // console.log('!!!', 'loading = false')
      this.loading = false

      return true
      // TODO: wtf?
    })

    let ref = this.reference
      .orderByKey()
      .limitToLast(chunkLength)

    if (this.lastPostKey) {
      ref = ref.endAt(this.lastPostKey)
    }

    return await ref.once('value')
      .then(callback)

  }

  @action appendFetchedPosts = async (payload) => {
    // console.log('!!!', 'start append')
    // Object.entries(payload).forEach(([postId, post]) => this.appendPost(postId, post))
    const posts = await this.convertPosts(payload)
      .then(posts => posts.reduce((acc, post) => {
        if (!this.entities[post.uid]) {
          acc[post.uid] = post
        }
        return acc
        // return {...acc, [post.uid]: post}
      }, {}))

    this.entities = {...this.entities, ...posts}

    // console.log('!!!', 'end append')
  }

  // TODO: maybe fetch user too?
  convertPosts = async (payload) => {
    return Promise.all(Object.entries(payload).map(async ([key, post]) => {
      const likes = Object.values(post.likes || {})

      post.uid = key
      post.key = key
      post.likesNumber = likes.length
      post.isLiked = likes.some(like => like.userId === this.user.uid)

      if (post.coords) {
        const [{name, city, country}] = await Location.reverseGeocodeAsync({...post.coords})
        post.location = name + (city ? ', ' + city : '') + (country ? ', ' + country : '')
      }

      post.user = await this.getStore(PEOPLE_STORE).getUserLazily(post.userId)

      return ({...post, key})
    }))
  }

  @action appendPost = async (postId, post) => {
    const likes = Object.values(post.likes || {})

    post.uid = postId
    post.key = postId
    post.likesNumber = likes.length
    post.isLiked = likes.some(like => like.userId === this.user.uid)

    if (post.coords) {
      const [{name, city, country}] = await Location.reverseGeocodeAsync({...post.coords})
      post.location = name + (city ? ', ' + city : '') + (country ? ', ' + country : '')
    }

    post.user = await this.getStore(PEOPLE_STORE).getUserLazily(post.userId)

    this.entities[postId] = post

  }

  @action refreshPost = async (postId) => {
    const callback = async (snapshot) => {
      const post = snapshot.val()
      // TODO: postId?
      const postId = snapshot.key
      // post.uid = snapshot.key

      // this.appendPost(post)
      await this.appendPost(postId, post)
    }

    await this.reference
      .child(postId)
      .once('value').then(callback)

  }

  @action fetchPost = async (postId) => {
    const callback = (snapshot) => {
      const post = snapshot.val()
      const postId = snapshot.key

      const likes = Object.values(post.likes || {})

      post.uid = postId
      post.key = postId
      post.likesNumber = likes.length
      post.isLiked = likes.some(like => like.userId === this.user.uid)

      return post
    }

    return await this.reference
      .child(postId)
      .once('value').then(callback)

  }

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
    this.reference
      .orderByKey()
      .startAt(this.lastPost.key)
      .once('value', callback)
  }

  @action setLike = async (postId) => {
    const ref = this.getLikesReference(postId)
    const post = this.entities[postId]

    if (post.likePending) return

    if (post.isLiked) {
      const {likes} = post
      // console.log('dislike')
      // const likes = Object.entries(this.entities[postId].likes).map(([key, like]) => ({...like, key}))
      // const {key} = likes.find(like => like.userId === this.user.uid)
      // ref.child(key).remove()

      // this thing is necessary for immediate likes
      // without waiting for update from server
      post.isLiked = false
      post.likesNumber--
      post.likePending = true

      this.entities[postId] = {...this.entities[postId], ...post}

      // promise.all
      // const likesArr = Object.entries(likes).map(([key, value]) => ({...value, key}))
      // if (likesArr.some(like => like.userId === this.user.uid )) {}

      let likeId

      for (let key in likes) {
        if (likes[key].userId === this.user.uid) {
          // console.log('remove', key)
          likeId = key
        }
      }

      if (likeId) {
        await ref.child(likeId).remove()
      }

    } else {
      // console.log('like')
      post.isLiked = true
      post.likesNumber++
      post.likePending = true

      this.entities[postId] = {...this.entities[postId], ...post}

      await ref.push({userId: this.user.uid})
    }

    post.likePending = false

    this.refreshPost(postId)

  }

  getPost = (postId) => {
    return this.entities[postId]
  }

  @action attachLocation = () => {
    const {latitude, longitude} = this.coords
    this.attachedCoords = {latitude, longitude}
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

    this.setCoords(coords)

    return coords
  }

  @action sendPost = async () => {

    // const post = {
    //   title: 'New! ' + loremIpsum({count: Math.random() * 8, units: 'words'}).replace(/\w/, x => x.toUpperCase()),
    //   text: loremIpsum({count: Math.random() * 10, units: 'sentences'}),
    //   coords: Math.round(Math.random()) ? {
    //     latitude: Math.random() * 20 + 40,
    //     longitude: Math.random() * 20
    //   } : null
    // }

    const newPost = {
      title: this.title,
      text: this.text,
      userId: this.user.uid,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      coords: this.attachedCoords && {
        latitude: this.attachedCoords.latitude,
        longitude: this.attachedCoords.longitude
      }
    }

    if (!this.title || !this.text) {
      alert('No text or title!')
      return
    }

    const {key} = await this.reference.push(newPost)
    // this.refreshFeed()
    this.refreshPost(key)
    this.getStore(NAVIGATION_STORE).goBack()
    this.clearPostForm()
    this.clearLocationForm()
  }

  getPostLikes = async (postId) => {
    const {likes} = this.entities[postId]
    // const {fetchUserInfo} = this.getStore(PEOPLE_STORE)
    const people = this.getStore(PEOPLE_STORE)

    return Promise.all(Object.entries(likes)
      .map(async ([key, {userId}]) => {
          const user = await people.getUserGreedily(userId)
          return {userId, user, key}
        }
      ))

    // this make possible to ignore false uids
    // return Promise.resolve(Object.entries(likes)
    //   .reduce(async (accPromise, [key, {userId}]) => {
    //       const acc = await accPromise
    //       const user = await fetchUserInfo(userId)
    //       if (!user) return acc
    //       return [...acc, {userId, user, key}]
    //     }, []
    //   ))
  }

  getUserLikedPosts = async (uid) => {
    const callback = (snapshot) =>
      Object.entries(snapshot.val() || {})
        .reduce((acc, [postId, {likes, title}]) =>
            likes && Object.values(likes).some(({userId}) => userId === uid)
              ? [...acc, {postId, title}]
              : acc,
          [])

    // let posts = []
    //
    // data.forEach(snapshot => {
    //   const {likes, title} = snapshot.val()
    //   const postId = snapshot.key
    //   if (!likes) return
    //
    //   const isLiked = Object.values(likes).some(({userId}) => userId === uid)
    //
    //   if (!isLiked) return
    //
    //   posts.push({postId, title})
    // })
    //
    // return posts

    return await this.reference
      .orderByChild(LIKES_REFERENCE)
      .limitToLast(10)
      .once('value')
      .then(callback)
  }

  getUserPosts = async (uid) => {
    const callback = (snapshot) =>
      Object.entries(snapshot.val() || {})
        .map(([postId, {title}]) => ({postId, title}))

    return await this.reference
      .orderByChild('userId')
      .equalTo(uid)
      .limitToLast(10)
      .once('value')
      .then(callback)
  }

  // DEPRECATED CODE

  // more flexible analogue of subscribing via on('child_added')
  // subscribeOnPosts = () => {
  //   this.refreshFeed()
  //   this.timer = setTimeout(this.subscribeOnPosts, 3000)
  // }

  // clearSubscribtionTimer = () => {
  //   clearTimeout(this.timer)
  // }

  @action setLikeBackend = (postId) => {
    const ref = this.getLikesReference(postId)

    const callback = (currentUserLikesData) => {
      const currentUserLikes = currentUserLikesData.val()

      if (currentUserLikes) {
        const [likeId] = Object.keys(currentUserLikes)

        ref.child(likeId).remove()

      } else {
        ref.push({userId: this.user.uid})
      }
    }

    ref.orderByChild('userId')
      .equalTo(this.user.uid)
      .once('value', callback)

  }

  @action subscribeOnLikes = (postId) => {
    const callback = action((snapshot) => {
      const payload = snapshot.val()
      const likes = Object.values(payload || {})
      const post = this.entities[postId]

      post.likes = payload
      post.likesNumber = likes.length
      post.isLiked = likes.some(like => like.userId === this.user.uid)

      // this.appendLikes(payload, post)
    })

    this.getLikesReference(postId).on('value', callback)
  }

  @action appendLikes = (payload, post) => {
    const likes = Object.values(payload || {})

    // post.likes = payload
    post.likesNumber = likes.length
    post.isLiked = likes.some(like => like.userId === this.user.uid)
  }

  postsToFb = async () => {
    const users = await firebase.database().ref('people').once('value').then(snapshot => Object.keys(snapshot.val()))
    console.log(users)

    const feedFixtures = Array.from({length: 50}, (_, i) => ({
      title: i + ' ' + loremIpsum({count: Math.random() * 8, units: 'words'}).replace(/\w/, x => x.toUpperCase()),
      text: loremIpsum({count: Math.random() * 20, units: 'sentences'}),
      // comments: [],
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      userId: users[Math.round(Math.random() * (users.length - 1))],
      coords: Math.round(Math.random()) ? {
        latitude: Math.random() * 20 + 40,
        longitude: Math.random() * 20
      } : null
      // likes: Array.from({length: Math.round(Math.random() * 200)}, (_, i) => ({uid: 'uid'}))
    }))

    feedFixtures.forEach(post => {
      const ref = this.reference.push(post)
      users.forEach(userId => Math.round(Math.random()) && this.getLikesReference(ref.key).push({userId}))

    })

  }

}

export default FeedStore