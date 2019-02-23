import mobx, {observable, action, computed} from 'mobx'
import firebase from 'firebase/app'
import BasicStore from './basic-store'
import {LoginManager, AccessToken} from 'react-native-fbsdk'
import EntitiesStore from './entities-store'
import {AsyncStorage} from 'react-native'
import {FileSystem, ImageManipulator} from 'expo'
import {USER_AVATAR_REFERENCE, CACHE_DIR, PEOPLE_REFERENCE, AVATARS_STORAGE_REFERENCE} from '../constants'
import {entitiesFromFB, urlToBlob} from './utils'
import path from 'path'

// TODO 1. Merge user and user-avatar
// TODO 3. New store class for user settings instead of entities-store
// TODO 4. if !user return

class UserAvatarStore extends EntitiesStore {
  constructor(...args) {
    super(...args)

    this.retrieveCachedUserAvatar()
  }

  get currentUserReference() {
    return firebase.database()
      .ref(PEOPLE_REFERENCE)
      .child(this.user.uid)
  }

  @action
  off() {
    this.clear()
    this.currentUserReference.child(USER_AVATAR_REFERENCE).off()
  }

  @computed
  get avatar() {
    return this.entities.avatar
  }

  cacheUserData = async (data) => {
    await AsyncStorage.mergeItem('user', JSON.stringify(data)).catch(console.error)
  }

  @action subscribeOnUserAvatar = () => {
    console.log('Subscribed on avatar changes')

    const callback = action(async data => {
      console.log('Checking avatar changes')

      const avatar = data.val()

      if (!avatar) {
        console.log('User has no avatar on server')

        if (this.entities.avatar) {
          this.entities.avatar = null
          await this.cacheUserData({avatar: null}).catch(console.error)
          console.log('Cached avatar data has been erased')
        }

        return
      }

      if (!this.entities.avatar) {
        console.log('User has no cached avatar')
        this.downloadCurrentUserAvatar(avatar).catch(err => console.warn('AVATAR:', 'download error'))
        return
      }

      /*
            if (!this.checkUserAvatarByToken(avatar)) {
              console.log('Cached avatar and server avatar are different')
              this.downloadUserAvatar(avatar).catch(console.error)
              return
            }
      */

      if (!avatar.includes('https://firebasestorage.googleapis.com/')) {
        console.log('Avatar from social network')
        return
      }

      const firebaseAvatarHash = await this.fetchCacheControl(avatar)

      // const {md5} = await FileSystem.getInfoAsync(this.entities.avatar, {md5: true})
      // console.log(firebaseAvatarHash, md5)

      if (firebaseAvatarHash !== this.entities.avatarCacheControl) {
        // if (firebaseAvatarHash !== md5) {
        console.log('Cached avatar and server avatar are different')
        this.downloadCurrentUserAvatar(avatar)
          .catch(err => console.warn('AVATAR:', 'update avatar error'))
        return
      }

      /*      await this.checkUserAvatarByHash(avatar)
              .then(async isMatch => {
                console.log('Avatar checked with result:', isMatch)

                if (!isMatch) {
                  console.log('Cached avatar and server avatar are different')
                  await this.downloadUserAvatar(avatar).catch(console.error)
                }
              })
              .catch(console.error)*/

      console.log('Avatar is up-to-date')
    })

    this.currentUserReference.child(USER_AVATAR_REFERENCE).on('value', callback)

  }

  /*
    checkUserAvatarByToken = (avatarUri) => {
      // Firebase functional only
      const cachedAvatarToken = this.entities.avatar.replace(/^.*\/\/|\.jpg$/g, '')
      const fetchedAvatarToken = avatarUri.replace(/^.*token=/g, '')
      console.log(fetchedAvatarToken, cachedAvatarToken)
      return fetchedAvatarToken === cachedAvatarToken
    }
  */

  /*
    checkUserAvatarByHash2 = async (avatarUri) => {

        // const localAvatarMD5 = await FileSystem.getInfoAsync(this.avatar, {md5: true})
        const localAvatarMD5 = await FileSystem.getInfoAsync(this.entities.avatar, {md5: true})
          .then(avatar => {
            // console.log(avatar.md5)
            return avatar.md5
          })
          .catch(err => console.log('md5 avatar fs error'))

        const avatarMD5 = await fetch(avatarUri)
          .then(avatar => {
            // console.log(avatar)
            return avatar.headers.get('etag').slice(1, -1)
          })
          .catch(err => console.log('md5 avatar fetch error'))

        // firebase.storage().refFromURL(avatarUri).getMetadata().then(console.log)
        // await avatarMD5.getMetadata().then(console.log)
        console.log('md5:', avatarMD5, localAvatarMD5)
        return avatarMD5 === localAvatarMD5

      }
  */

  // checkUserAvatarByHash = async (uri) => {
  //
  //   /*    const {avatarHash} = await AsyncStorage
  //         .getItem('user')
  //         .then(res => JSON.parse(res))
  //         .catch(err => console.log('AvatarHash AsyncStorage error!'))*/
  //
  //   const storageAvatarHash = this.entities.avatarHash
  //
  //   // console.log('local avatar', storageAvatarHash)
  //
  //   const {md5Hash: firebaseAvatarHash} = await firebase
  //     .storage()
  //     .refFromURL(uri)
  //     .getMetadata()
  //     .catch(err => console.log('AvatarHash Firebase error!'))
  //
  //   // console.log('server avatar', firebaseAvatarHash)
  //
  //   return firebaseAvatarHash === storageAvatarHash
  //
  // }

  fetchCacheControl = async (uri) => {
    const {cacheControl} = await firebase
      .storage()
      .refFromURL(uri)
      .getMetadata()
      .catch(err => console.log('AvatarHash Firebase error!'))

    return cacheControl
  }

  @action downloadCurrentUserAvatar = async (uri) => {
    this.loading = true
    console.log('Downloading avatar...')

    let name = ''
    if (uri.includes('https://firebasestorage.googleapis.com/')) {
      // Firebase functional only
      name = uri.replace(/^.*token=/g, '')
    } else {
      name = this.user.uid
    }

    // downloading the file from uri to device
    const avatarPath = path.join(CACHE_DIR, name + '.jpg')
    const {uri: avatar} = await FileSystem.downloadAsync(uri, avatarPath)
    const avatarCacheControl = await this.fetchCacheControl(uri)

    this.cacheUserData({avatar, avatarCacheControl}).catch(console.error)

    if (this.entities.avatar && this.entities.avatar !== avatar) {
      FileSystem.deleteAsync(this.entities.avatar, {idempotent: true})
    }

    this.entities.avatar = avatar
    this.entities.avatarCacheControl = avatarCacheControl
    this.loading = false
    this.loaded = true

    console.log('Avatar has been downloaded')

  }

  @action retrieveCachedUserAvatar = async () => {
    const res = await AsyncStorage.getItem('user').catch(err => console.log('AVATAR: AsyncStorage error'))

    console.log('AVATAR:', 'get item')
    if (!res) {
      console.log('AVATAR:', 'There is no cached user')
      return
    }

    const {avatar, avatarCacheControl} = JSON.parse(res)

    if (!avatar) {
      console.log('AVATAR:', 'No cached avatar')
      return
    }

    const {exists} = await FileSystem.getInfoAsync(avatar).catch(err => console.log('AVATAR:', 'FS error'))

    if (!exists) {
      console.log('User avatar file has not been found')
      return
    }

    console.log('AVATAR:', 'avatar retrieved')

    this.entities.avatar = avatar
    this.entities.avatarCacheControl = avatarCacheControl
  }

  @action
  takePhoto = async ({uri, base64}) => {
    const {uid} = this.user

    this.loading = true

    if (this.entities.avatar) {
      await FileSystem.deleteAsync(this.entities.avatar, {idempotent: true})
    }

    // TODO: in rn 58 expo 32 fetch api returns zero-sized blob, so using polyfill
    // const file = await fetch(uri).then(res => res.blob())
    const {uri: manipulatedUri} = (await ImageManipulator.manipulateAsync(uri, [{resize: {width: 200}}]))

    this.entities.avatar = manipulatedUri
    const file = await urlToBlob(manipulatedUri)
    const {md5} = await FileSystem.getInfoAsync(manipulatedUri, {md5: true})
    this.entities.avatarCacheControl = md5

    const ref = firebase.storage()
      .ref(AVATARS_STORAGE_REFERENCE)
      .child(`${uid}.jpg`)

    console.log('AVATAR:', 'uploading...')

    await ref.put(file).then(res => console.log('AVATAR:', 'uploaded!'))
    const avatar = await ref.getDownloadURL()
    await ref.updateMetadata({cacheControl: md5})

    // this.entities.avatarHash = md5
    console.log(md5)
    console.log(manipulatedUri)
    this.cacheUserData({avatar: manipulatedUri, avatarCacheControl: md5}).catch(console.error)

    this.updateUserData({avatar})
      .then(action(res => {

        this.loading = false
        this.loaded = true
      }))
  }

  async updateUserData(data) {
    await
      this.currentUserReference.update(data)
  }

}

export default UserAvatarStore