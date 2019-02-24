import {observable, computed, action} from 'mobx'
import BasicStore from './basic-store'
import firebase from 'firebase'
import {entitiesFromFB} from './utils'
import {AUTH_STORE} from '../constants'
import {AsyncStorage} from 'react-native'
import {toJS} from 'mobx'

class EntitiesStore extends BasicStore {
  constructor(...args) {
    super(...args)
    this.retrieveCachedEntities()
  }

  @observable loading = false
  @observable loaded = false

  @observable entities = {}

  @computed
  get user() {
    return this.getStore(AUTH_STORE).user
  }

  @computed
  get list() {
    return Object.values(this.entities)
  }

  @action clear = () => {
    this.entities = {}
    this.loading = false
    this.loaded = false
  }

  @computed
  get size() {
    return Object.keys(this.entities).length
  }

  cache = async (obj) => {
    // console.log(obj)
    // console.log(Object.values(toJS(obj)).sort((a, b) => b.timestamp - a.timestamp).slice(0, 10).reduce((acc, c) => ({...acc, [c.key]: c}), {}))
    return await AsyncStorage.setItem(`meowchat:store:${this.storeName}`, JSON.stringify(toJS(obj)))
  }

  cacheEntities = async () => {
    console.log('CACHE:', 'cache entities from store', this.storeName)
    return await AsyncStorage.mergeItem(`meowchat:store:${this.storeName}`, JSON.stringify(toJS(this.entities)))
  }

  @action retrieveCachedEntities = async () => {
    console.log('CACHE:', 'get entities from store', this.storeName)
    const cachedEntities = await AsyncStorage.getItem(`meowchat:store:${this.storeName}`)
      .then(JSON.parse)

    if (!cachedEntities) {
      console.log('CACHE:', 'get entities from store', this.storeName)
      return
    }

    this.entities = cachedEntities

    return cachedEntities
  }
}

export function loadAllHelper(refName) {
  return action(function () {
    this.loading = true
    console.log(refName)

    firebase.database().ref(refName)
      .once('value', action(data => {
        this.entities = entitiesFromFB(data.val())
        this.loading = false
        this.loaded = true
      }))
  })
}

// export function subscribeHelper(refName) {
//   return action(function () {
//     this.loading = true
//
//     const callback = action(data => {
//       this.entities = entitiesFromFB(data.val())
//       this.loading = false
//       this.loaded = true
//     })
//
//     firebase.database().ref(refName).on('value', callback)
//
//     return () => firebase.database().ref(refName).off('value', callback)
//   })
// }

// export function loadDataHelper(refName) {
//   return action(function (uid) {
//     const path = refName + '/' + uid
//
//     this.loading = true
//
//     console.log('loading user ', path)
//
//     firebase.database().ref(path)
//       .once('value', action(data => {
//         this.entities = data.val()
//         this.loading = false
//         this.loaded = true
//
//         // console.log(this.entities)
//       }))
//   })
// }

export default EntitiesStore