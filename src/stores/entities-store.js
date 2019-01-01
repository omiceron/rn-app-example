import {observable, computed, action} from 'mobx'
import BasicStore from './basic-store'
import firebase from 'firebase'
import {entitiesFromFB} from './utils'
import {AUTH_STORE} from '../constants'

class EntitiesStore extends BasicStore {

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

  @action
  clear() {
    this.entities = {}
    this.loading = false
    this.loaded = false
  }

  @computed
  get size() {
    return Object.keys(this.entities).length
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

export function subscribeHelper(refName) {
  return action(function () {
    this.loading = true

    const callback = action(data => {
      this.entities = entitiesFromFB(data.val())
      this.loading = false
      this.loaded = true
    })

    firebase.database().ref(refName).on('value', callback)

    return () => firebase.database().ref(refName).off('value', callback)
  })
}
//
export function loadDataHelper(refName) {
  return action(function (uid) {
    const path = refName + '/' + uid

    this.loading = true

    console.log('loading user ', path)

    firebase.database().ref(path)
      .once('value', action(data => {
        this.entities = data.val()
        this.loading = false
        this.loaded = true

        // console.log(this.entities)
      }))
  })
}

export default EntitiesStore