import EntitiesStore from './entities-store'
import {computed, action} from 'mobx'
import groupBy from 'lodash/groupBy'
import firebase from 'firebase/app'
import {AUTH_STORE, AVATARS_STORAGE_REFERENCE, PEOPLE_REFERENCE, USER_STORE} from '../constants'

class PeopleStore extends EntitiesStore {

  @computed
  get sections() {
    const grouped = groupBy(this.list, ({firstName, email}) => (firstName || email)[0].toUpperCase())

    return Object.entries(grouped)
      .map(([title, list]) => ({
        title,
        data: list.map(person => ({key: person.uid, person})).sort((a, b) => a.firstName > b.firstName)
      }))
      .sort((a, b) => a.title > b.title)
  }

  get reference() {
    return firebase.database().ref(PEOPLE_REFERENCE)
  }

  off() {
    this.reference.off()
  }

  fetchUserInfo = async (uid) => {
    return await this.reference.child(uid)
      .once('value')
      .then(snapshot => {
        const userData = snapshot.val()

        if (!userData) return

        const {avatar, email, firstName, lastName, userInfo} = userData
        return {avatar, email, firstName, lastName, userInfo, uid}
      })
  }

  @action
  async createPerson(uid) {
    await this.reference
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

          this.reference.child(uid).update({firstName, lastName, email, avatar: photoURL})
        }
      })
  }

  @action fetchPeople = () => {
    if (this.loading) return

    this.loading = true
    const callback = action(data => {
      this.entities = Object.entries(data.val()).map(([key, {avatar, email, firstName, lastName, userInfo}]) =>
        ({uid: key, avatar, email, firstName, lastName, userInfo}))
      this.loading = false
      this.loaded = true
    })

    this.reference.once('value', callback)
  }

  async takePhoto(userId, uri) {
    const file = await fetch(uri).then(res => res.blob())
    const ref = firebase.storage()
      .ref(AVATARS_STORAGE_REFERENCE)
      .child(`${userId}.jpg`)

    await ref.put(file)
    const avatar = await ref.getDownloadURL()

    await this.getStore(USER_STORE).updatePerson(userId, {avatar})
  }

}

export default PeopleStore