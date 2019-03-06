import mobx, {action, computed} from 'mobx'
import firebase from 'firebase/app'
import EntitiesStore from './entities-store'
import {AsyncStorage} from 'react-native'
import {FileSystem} from 'expo'
import {CACHE_DIR, PEOPLE_REFERENCE} from '../constants'
import {entitiesFromFB} from './utils'
import {observer} from 'mobx-react'
import {autorun} from 'mobx'
import {toJS} from 'mobx'


class UserStore extends EntitiesStore {

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
  get currentUserId() {
    return this.entities.uid || this.user.uid
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
      .update(toJS(this.entities))
      .then(() => console.log('User data has been successfully updated'))
  }

  @action subscribeOnUserData = () => {
    console.log('Subscribed on user data changes...')

    const callback = action(async (snapshot) => {
      this.loading = true

      // TODO undefined entities
      const {firstName = null, lastName = null, userInfo = null} = snapshot.val() || {}
      const uid = snapshot.key || null

      this.entities = {...this.entities, firstName, lastName, userInfo, uid}

      await this.cacheEntities()

      this.loading = false
      // this.loaded = true

      console.log('User data updated')

    })

    this.currentUserReference.on('value', callback)

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

  async updatePerson(uid, data) {
    await firebase.database()
      .ref(PEOPLE_REFERENCE)
      .child(uid)
      .update(data)
  }

}

export default UserStore