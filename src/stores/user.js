import mobx, {action, computed} from 'mobx'
import firebase from 'firebase/app'
import EntitiesStore from './entities-store'
import {AsyncStorage} from 'react-native'
import {FileSystem} from 'expo'
import {CACHE_DIR, PEOPLE_REFERENCE} from '../constants'
import {entitiesFromFB} from './utils'
import {observer} from 'mobx-react'
import {autorun} from 'mobx'

class UserStore extends EntitiesStore {
  constructor(...args) {
    super(...args)
    // console.log(this.getStore('people'))
    this.retrieveCachedUserData()
  }

  get currentUserReference() {
    return firebase.database()
      .ref(PEOPLE_REFERENCE)
      .child(this.user.uid)
  }

  @computed
  get firstName() {
    return this.entities.firstName
  }

  @computed
  get lastName() {
    return this.entities.lastName
  }

  @computed
  get userInfo() {
    return this.entities.userInfo
  }

  off() {
    this.currentUserReference.child('online').set(firebase.database.ServerValue.TIMESTAMP)
    this.clear()
    this.currentUserReference.off()
  }

  @action setFirstName = firstName => this.entities.firstName = firstName
  @action setLastName = lastName => this.entities.lastName = lastName
  @action setUserInfo = userInfo => this.entities.userInfo = userInfo

  @action updateUserData = () => {
    this.currentUserReference
      .update(this.entities)
      .then(() => console.log('User data has been successfully updated'))
  }

  @action subscribeOnUserData = (uid) => {
    console.log('Subscribed on user data changes...')

    const callback = action(data => {
      this.loading = true

      const {firstName = null, lastName = null, userInfo = null} = data.val() || {}

      this.entities = {...this.entities, firstName, lastName, userInfo}

      this.cacheUserData({uid, firstName, lastName, userInfo}).catch(console.error)

      this.loading = false
      this.loaded = true

      console.log('User data updated')

    })

    this.currentUserReference.on('value', callback)

  }

  cacheUserData = async (data) => {
    await AsyncStorage.mergeItem('user', JSON.stringify(data)).catch(console.error)
  }

  startPresenceWatcher = () => {
    const presenceRef = this.currentUserReference.child('online')

    const callback = (snapshot) => {
      if (snapshot.val()) {
        presenceRef.set(true)
        presenceRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP)
      }
    }

    firebase.database().ref('.info/connected')
      .on('value', callback)
  }

  @action retrieveCachedUserData = () => {
    AsyncStorage.getItem('user')
      .then(res => {
        if (!res) {
          console.log('There is no cached user')
          return
        }

        const {firstName, lastName, userInfo} = JSON.parse(res)
        this.entities = {firstName, lastName, userInfo}
        this.loaded = true
      })
      .catch(err => console.log('AsyncStorage error'))
  }

  async updatePerson(uid, data) {
    await firebase.database()
      .ref(PEOPLE_REFERENCE)
      .child(uid)
      .update(data)
  }

}

export default UserStore