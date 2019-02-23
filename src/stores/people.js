import EntitiesStore from './entities-store'
import {computed, action} from 'mobx'
import groupBy from 'lodash/groupBy'
import firebase from 'firebase/app'
import {AVATARS_STORAGE_REFERENCE, PEOPLE_REFERENCE, USER_STORE, CACHE_DIR, MESSENGER_STORE} from '../constants'
import path from 'path'
import {FileSystem} from 'expo'
import {AsyncStorage} from 'react-native'
import {alphabetic, urlToBlob} from './utils'
import {Image} from 'react-native'
import {toJS} from 'mobx'

class PeopleStore extends EntitiesStore {
  @computed
  get sections() {
    const grouped = groupBy(this.entities, ({firstName}) => firstName[0].toUpperCase())

    return Object.entries(grouped)
      .map(([title, section]) => ({
        title,
        data: section
          .map(user => ({key: user.uid, user}))
          .sort(alphabetic(['user', 'firstName']))
      }))
      .sort(alphabetic('title'))
  }

  get reference() {
    return firebase.database().ref(PEOPLE_REFERENCE)
  }

  off() {
    this.clear()
    this.reference.off()
  }

  // Use this when using async is not possible or not necessary
  getUser = (userId) => {
    return this.entities[userId]
  }

  // TODO: flags?
  @action getUserLazily = async (userId) => {
    if (!this.entities[userId]) await this.refreshUser(userId)
    return this.entities[userId]
  }

  @action getUserGreedily = async (userId) => {
    await this.refreshUser(userId)
    return this.entities[userId]
  }

  @action appendUser = (user) => {
    const oldUser = this.entities[user.uid] || {}
    this.entities[user.uid] = {...oldUser, ...user}
    return this.entities[user.uid]
  }

  @action refreshUser = async (userId) => {
    const callback = async (snapshot) => {
      return await
        this.convertUser({[userId]: snapshot.val()})
          .then(this.appendUser)
    }

    return await this.reference
      .child(userId)
      .once('value')
      .then(callback)
  }

  @action convertUser = async (payload) => {
    const [user] = await this.convertUsers(payload)
    return user
  }

  @action convertUsers = async (payload) => {
    return Promise.all(Object.entries(payload).map(async ([key, {chats, ...user}]) => {
      user.uid = key
      // const {uri, avatarCacheControl} = await this.downloadUserAvatar(user.avatar, key)
      user.avatar = await this.downloadUserAvatar(user.avatar, key)
      // user.avatar = uri
      // user.avatarCacheControl = avatarCacheControl
      return {...user, key}
    }))
  }

  @action fetchAllUsers = () => {
    if (this.loaded || this.loading) return

    this.loading = true

    const callback = action(async snapshot => {
      const payload = snapshot.val() || {}

      // const users = await Promise.resolve(Object.entries(payload)
      //   .reduce(async (accAsync, [userId, {chats, ...user}]) => {
      //     const acc = await accAsync
      //     user.uid = userId
      //     user.avatar = await this.downloadUserAvatar(user.avatar, userId)
      //     return {...acc, [userId]: user}
      //   }, {}))
      //
      // this.entities = {...this.entities, ...users}

      // TODO: render issue
      await this.appendFetchedUsers(payload)
      await this.cacheEntities()
      this.loaded = true
      this.loading = false
    })

    this.reference.once('value', callback)
  }

  @action appendFetchedUsers = async (payload) => {
    const users = await
      this.convertUsers(payload)
        .then(users => users.reduce((acc, user) => ({...acc, [user.uid]: user}), {}))

    this.entities = {...this.entities, ...users}
  }

  updateUserCache = async (userId, data) => {
    return await AsyncStorage.mergeItem(`meowchat:store:users:${userId}`, JSON.stringify(data))
      .catch(err => console.warn('PEOPLE:', 'AsyncStorage update cache error'))
  }

  getUserCache = async (userId) => {
    return await AsyncStorage.getItem(`meowchat:store:users:${userId}`)
      .then(JSON.parse)
      .catch(err => console.warn('PEOPLE:', 'AsyncStorage get cache error'))
  }

  fetchCacheControl = async (uri) => {
    const {cacheControl} = await firebase
      .storage()
      .refFromURL(uri)
      .getMetadata()
      .catch(err => console.warn('PEOPLE:', 'fetchCacheControl Firebase error'))

    return cacheControl
  }

  @action downloadUserAvatar = async (url, userId) => {
    if (!url) {
      // TODO handle undefined url
      // console.log('PEOPLE:', userId, 'has no avatar')
      return
    }
    const avatarsDirectory = path.join(CACHE_DIR, AVATARS_STORAGE_REFERENCE)

    const {isDirectory} = await FileSystem.getInfoAsync(avatarsDirectory)
      .catch(err => console.warn('PEOPLE:', 'FileSystem getInfoAsync isDirectory error'))

    if (!isDirectory) await FileSystem.makeDirectoryAsync(avatarsDirectory, {intermediates: true})
      .catch(err => console.warn('PEOPLE:', 'FileSystem makeDirectoryAsync error'))

    const avatarPath = path.join(avatarsDirectory, userId + '.jpg')
    const {exists} = await FileSystem.getInfoAsync(avatarPath)
      .catch(err => console.warn('PEOPLE:', 'FileSystem getInfoAsync exist error'))

    const avatarCacheControl = await this.fetchCacheControl(url)

    if (exists) {
      // console.log('PEOPLE:', userId, 'avatar exists, checking cache...')
      const userCache = await this.getUserCache(userId)

      // if (this.entities[userId] && this.entities[userId].avatarCacheControl === avatarCacheControl) {
      if (userCache && userCache.avatarCacheControl === avatarCacheControl) {
        // console.log('PEOPLE:', userId, 'avatar is up-to-date')
        return avatarPath
        // return {uri: avatarPath, avatarCacheControl}
      }
    }

    // console.log('PEOPLE:', userId, 'avatar does not exist or cache test failed. Downloading avatar...')

    const {uri} = await FileSystem.downloadAsync(url, avatarPath)
      .catch(err => console.warn('PEOPLE:', 'FileSystem downloadAsync uri error'))

    await this.updateUserCache(userId, {uri, avatarCacheControl})

    // console.log('PEOPLE:', userId,  'avatar has been downloaded')

    // return {uri, avatarCacheControl}

    return uri
  }

  async takePhoto(userId, uri) {
    const file = await urlToBlob(uri)
    const ref = firebase.storage()
      .ref(AVATARS_STORAGE_REFERENCE)
      .child(`${userId}.jpg`)

    await ref.put(file)
    const avatar = await ref.getDownloadURL()

    await this.getStore(USER_STORE).updatePerson(userId, {avatar})
  }

}

export default PeopleStore