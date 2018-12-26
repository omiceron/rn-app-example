import EntitiesStore, {subscribeHelper} from './entities-store'
import {computed, action} from 'mobx'
import groupBy from 'lodash/groupBy'
import firebase from 'firebase/app'
import {decode} from 'base64-arraybuffer'
import {AUTH_STORE, PEOPLE_REFERENCE} from '../constants'

class PeopleStore extends EntitiesStore {

  @computed
  get sections() {
    const grouped = groupBy(this.list, ({firstName, email}) => (firstName || email)[0].toUpperCase())

    return Object.entries(grouped).map(([letter, list]) => ({
      title: `${letter}`,
      data: list.map(person => ({key: person.uid, person})),
    })).sort((a, b) => a.title > b.title)
  }

  get ref() {
    return firebase.database().ref(PEOPLE_REFERENCE)
  }

  @action updatePerson = (uid, data) => this.ref.child(uid).update(data)

  getFirstNameByUID = async (uid) => {
    return await firebase.database().ref(PEOPLE_REFERENCE).child(uid)
      .once('value')
      .then(data => data.val() && data.val().firstName || 'DELETED')
  }

  getLastNameByUID = async (uid) => {
    return await firebase.database().ref(PEOPLE_REFERENCE).child(uid)
      .once('value')
      .then(data => data.val() && data.val().lastName || 'DELETED')
  }

  fetchUserInfo = async (uid) => {
    return await this.ref.child(uid)
      .once('value')
      .then(data => {

        if (!data.val()) return

        const {avatar, email, firstName, lastName, userInfo} = data.val()
        return {avatar, email, firstName, lastName, userInfo, uid}
      })
  }


  fetchUserInfo2 = async (uid) => {
    const callback = (data) => {
      const {avatar, email, firstName, lastName} = data.val()
      // console.log(123, data.val())
      return {avatar, email, firstName, lastName}
    }

    return await this.ref
      .child(uid)
      .on('value', callback)
  }

  @action
  async createPerson(uid) {
    await this.ref
      .child(uid)
      .once('value', async snapshot => {
        if (!snapshot.exists()) {
          const {email, photoURL, displayName} = firebase.auth().currentUser

          let firstName = null, lastName = null

          if (displayName) {
            [firstName, lastName] = displayName.split(' ')
          } else {
            const {firstName: newUserFirstName} = this.getStore(AUTH_STORE)
            if (newUserFirstName) {
              firstName = newUserFirstName
              firebase.auth().currentUser.updateProfile({displayName: newUserFirstName})
            }
          }

          this.ref.child(uid).update({firstName, lastName, email, avatar: photoURL})
        }
      })
  }

  @action loadAll = () => {
    this.loading = true
    const callback = action(data => {
      this.entities = Object.entries(data.val()).map(([key, {avatar, email, firstName, lastName, userInfo}]) =>
        ({uid: key, avatar, email, firstName, lastName, userInfo}))
      this.loading = false
      this.loaded = true
    })

    this.ref.on('value', callback)

    return () => this.ref.off('value', callback)
  }

  // @action loadAll = subscribeHelper('people')

  async takePhoto(userId, uri) {
    //const buf = decode(base64)
    const file = await fetch(uri).then(res => res.blob())
    const ref = firebase.storage().ref(`/avatars/${userId}.jpg`)

    await ref.put(file)
    const avatar = await ref.getDownloadURL()

    this.updatePerson(userId, {avatar})
  }

}

export default PeopleStore