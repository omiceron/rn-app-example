import {observable, action, computed} from 'mobx'
import firebase from 'firebase/app'
import BasicStore from './basic-store'
import EntitiesStore from './entities-store'
import * as FileSystem from 'expo-file-system'
import {ImageManipulator, MediaLibrary} from 'expo'
import {
  USER_AVATAR_REFERENCE, CACHE_DIR, PEOPLE_REFERENCE, AVATARS_STORAGE_REFERENCE,
  NAVIGATION_STORE
} from '../constants'
import {urlToBlob} from './utils'
import path from 'path'
import {reaction} from 'mobx'

// TODO 1. Merge user and user-avatar
// TODO 3. New store class for user settings instead of entities-store
// TODO 4. if !user return

class UserAvatarStore extends EntitiesStore {
  constructor(...args) {
    super(...args)

    reaction(
      () => this.entities.uri,
      this.checkExistence
    )

  }

  get currentUserReference() {
    return firebase.database()
      .ref(PEOPLE_REFERENCE)
      .child(this.user.uid)
  }
  
  get currentUserAvatarStorageReference() {
    return firebase.storage()
      .ref(AVATARS_STORAGE_REFERENCE)
      .child(this.user.uid + '.jpg')
  }

  @computed
  get uri() {
    return this.entities.uri
  }

  getCurrentUserAvatarUri = async () => {
    return this.getAvatarUri(this.user.uid)
  }

  getAvatarUri = async (userId) => {
    const avatarsDirectory = path.join(CACHE_DIR, AVATARS_STORAGE_REFERENCE)

    const {isDirectory} = await FileSystem.getInfoAsync(avatarsDirectory)
      .catch(console.warn)

    if (!isDirectory) await FileSystem.makeDirectoryAsync(avatarsDirectory, {intermediates: true})
      .catch(console.warn)

    return path.join(avatarsDirectory, userId + '.jpg')
  }

  @action
  off() {
    this.clear()
    this.currentUserReference.child(USER_AVATAR_REFERENCE).off()
  }

  @action subscribeOnUserAvatar = () => {
    console.log('Subscribed on avatar changes')

    const callback = action(async (snapshot) => {
      console.log('Checking avatar changes')

      const uri = snapshot.val()

      if (!uri) {
        console.log('User has no avatar on server')

        if (this.entities.uri) {
          this.entities.uri = null
          await this.cacheEntities()
            .catch(console.warn)

          console.log('Cached avatar data has been erased')
        }

        return
      }

      if (!this.entities.uri) {
        console.log('User has no cached avatar')
        this.downloadCurrentUserAvatar(uri)
          .catch(err => console.warn('AVATAR:', 'download error'))
        return
      }

      const firebaseAvatarHash = await this.fetchCacheControl(uri)
        .catch(console.warn)

      if (firebaseAvatarHash !== this.entities.cacheControl) {
        console.log('Cached avatar and server avatar are different')
        this.downloadCurrentUserAvatar(uri)
          .catch(err => console.warn('AVATAR:', 'update avatar error'))
        return
      }

      console.log('Avatar is up-to-date')
    })

    this.currentUserReference.child(USER_AVATAR_REFERENCE).on('value', callback)

  }

  fetchCacheControl = async (uri) => {
    const {cacheControl} = await firebase
      .storage()
      .refFromURL(uri)
      .getMetadata()
      .catch(err => console.log('AvatarHash Firebase error!'))

    return cacheControl
  }

  @action downloadCurrentUserAvatar = async (url) => {
    this.loading = true
    console.log('Downloading avatar...')

    const avatarUri = await this.getAvatarUri(this.user.uid)

    // downloading the file from uri to device
    const {uri} = await FileSystem.downloadAsync(url, avatarUri)
      .catch(console.warn)

    const cacheControl = await this.fetchCacheControl(url)
      .catch(console.warn)

    this.entities.uri = uri
    this.entities.cacheControl = cacheControl

    await this.cacheEntities()
      .catch(console.warn)

    this.loading = false

    console.log('Avatar has been downloaded')

  }

  @action
  takePhoto = async ({uri, cancelled}, doNotSave) => {
    if (this.loading || cancelled) return
    this.loading = true

    this.entities.uri = uri

    if (!doNotSave) {
      console.log('AVATAR:', 'saving to camera roll...')
      MediaLibrary.createAssetAsync(uri)
        .then(() => console.log('AVATAR:', 'saved to camera roll'))
        .catch(console.warn)
    }

    // TODO: in rn 58 expo 32 fetch api returns zero-sized blob, so using polyfill
    // const file = await fetch(uri).then(res => res.blob())

    console.log('AVATAR:', 'resizing photo...')
    const {uri: resizedAvatarUri} = await ImageManipulator.manipulateAsync(uri, [{resize: {width: 200}}])
      .catch(console.warn)
    console.log('AVATAR:', 'photo resized')

    const userId = this.user.uid
    const avatarUri = await this.getAvatarUri(userId)
      .catch(console.warn)

    await FileSystem.copyAsync({from: resizedAvatarUri, to: avatarUri})
      .catch(console.warn)

    FileSystem.deleteAsync(resizedAvatarUri, {idempotent: true})
      .then(() => console.log('AVATAR:', 'resized photo deleted'))
      .catch(console.warn)

    const file = await urlToBlob(avatarUri)
      .catch(console.warn)

    const {md5: cacheControl} = await FileSystem.getInfoAsync(avatarUri, {md5: true})
      .catch(console.warn)

    const ref = firebase.storage()
      .ref(AVATARS_STORAGE_REFERENCE)
      .child(userId + '.jpg')

    console.log('AVATAR:', 'uploading...')
    await ref.put(file)
      .catch(console.warn)
    console.log('AVATAR:', 'uploaded!')

    const newAvatarUrl = await ref.getDownloadURL()
      .catch(console.warn)

    await ref.updateMetadata({cacheControl})
      .catch(console.warn)
    console.log('AVATAR:', 'cacheControl updated')

    await this.updateUserData({avatar: newAvatarUrl})
      .catch(console.warn)
    console.log('AVATAR:', 'database updated')

    this.entities.uri = avatarUri
    this.entities.cacheControl = cacheControl

    await this.cacheEntities()
      .catch(console.warn)
    console.log('AVATAR:', 'cached')

    this.loading = false

    return newAvatarUrl
  }

  @action checkExistence = async () => {
    console.log('AVATAR:', 'check existence')

    if (!this.entities.uri) return

    const {exists} = await FileSystem.getInfoAsync(this.entities.uri)
      .catch(console.warn)

    if (!exists) {
      console.log('User avatar file has not been found')
      this.entities = {}
    }

  }

  updateUserData = async (data) => {
    await this.currentUserReference.update(data)
      .catch(console.warn)
  }

}

export default UserAvatarStore