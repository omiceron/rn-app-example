import mobx, {observable, action, computed} from 'mobx'
import firebase from 'firebase/app'
import BasicStore from './basic-store'
import {LoginManager, AccessToken} from 'react-native-fbsdk'
import EntitiesStore from './entities-store'
import {AsyncStorage} from 'react-native'
import {FileSystem} from 'expo'
import {USER_AVATAR_REFERENCE, LOCAL_AVATAR_URI, PEOPLE_REFERENCE, AVATARS_STORAGE_REFERENCE} from '../constants'
import {entitiesFromFB} from './utils'

// TODO 1. Merge user and user-avatar
// TODO 2. Avatar hash-type like {uri, hash} instead of avatar and avatarHash
// TODO 3. New store class for user settings instead of entities-store

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
        this.downloadUserAvatar(avatar).catch(console.error)
        return
      }

      /*
            if (!this.checkUserAvatarByToken(avatar)) {
              console.log('Cached avatar and server avatar are different')
              this.downloadUserAvatar(avatar).catch(console.error)
              return
            }
      */

      const firebaseAvatarHash = await this.getHashFromUri(avatar)

      if (firebaseAvatarHash !== this.entities.avatarHash) {
        console.log('Cached avatar and server avatar are different')
        this.downloadUserAvatar(avatar, firebaseAvatarHash).catch(console.error)
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

  checkUserAvatarByHash = async (uri) => {

    /*    const {avatarHash} = await AsyncStorage
          .getItem('user')
          .then(res => JSON.parse(res))
          .catch(err => console.log('AvatarHash AsyncStorage error!'))*/

    const storageAvatarHash = this.entities.avatarHash

    // console.log('local avatar', storageAvatarHash)

    const {md5Hash: firebaseAvatarHash} = await firebase
      .storage()
      .refFromURL(uri)
      .getMetadata()
      .catch(err => console.log('AvatarHash Firebase error!'))

    // console.log('server avatar', firebaseAvatarHash)

    return firebaseAvatarHash === storageAvatarHash

  }

  getHashFromUri = async (uri) => {
    const {md5Hash} = await firebase
      .storage()
      .refFromURL(uri)
      .getMetadata()
      .catch(err => console.log('AvatarHash Firebase error!'))

    return md5Hash
  }

  @action downloadUserAvatar = async (uri, avatarHash) => {
    this.loading = true
    console.log('Downloading avatar...')

    // Firebase functional only
    const name = uri.replace(/^.*token=/g, '')

    // getting hash from server avatar
    if (!avatarHash) {
      avatarHash = await this.getHashFromUri(uri)
    }

    // downloading the file from uri to device
    await FileSystem.downloadAsync(uri, `${LOCAL_AVATAR_URI}/${name}.jpg`)
      .then(action(({uri: avatar}) => {

        // cashing new path and hash
        this.cacheUserData({avatar, avatarHash}).catch(console.error)

        // deleting previous avatar file if exists
        if (this.entities.avatar) {
          FileSystem.deleteAsync(this.entities.avatar, {idempotent: true})
        }

        this.entities = {avatar, avatarHash}
        this.loading = false
        this.loaded = true

        console.log('Avatar has been downloaded')

      }))
      .catch(err => console.log('Download avatar error'))
  }

  @action retrieveCachedUserAvatar = () => {
    AsyncStorage.getItem('user')
      .then(async res => {
        if (!res) {
          console.log('There is no cached user')
          return
        }

        const {avatar, avatarHash} = JSON.parse(res)
        const {exists} = await FileSystem.getInfoAsync(avatar)

        if (!exists) {
          console.log('User avatar file has not been found')
          return
        }

        this.entities = {avatar, avatarHash}
      })
      .catch(err => console.log('AsyncStorage error'))
  }

  @action
  takePhoto = async ({uri}) => {
    const {uid} = this.user

    this.loading = true

    if (this.entities.avatar) {
      FileSystem.deleteAsync(this.entities.avatar, {idempotent: true})
    }

    this.entities.avatar = uri

    const file = await fetch(uri).then(res => res.blob())
    const ref = firebase.storage()
      .ref(AVATARS_STORAGE_REFERENCE)
      .child(`${uid}.jpg`)

    console.log('Avatar uploading...')

    await ref.put(file).then(res => console.log('Avatar uploaded!'))
    const avatar = await ref.getDownloadURL()
    const {md5Hash} = await ref.getMetadata()

    this.entities.avatarHash = md5Hash

    this.cacheUserData({avatar: uri, avatarHash: md5Hash}).catch(console.error)

    this.updateUserData({avatar})
      .then(action(res => {

        this.loading = false
        this.loaded = true
      }))
  }

  async updateUserData(data) {
    await this.currentUserReference.update(data)
  }

}

export default UserAvatarStore