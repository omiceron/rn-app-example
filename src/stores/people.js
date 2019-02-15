import EntitiesStore from './entities-store'
import {computed, action} from 'mobx'
import groupBy from 'lodash/groupBy'
import firebase from 'firebase/app'
import {AVATARS_STORAGE_REFERENCE, PEOPLE_REFERENCE, PEOPLE_STORE, USER_STORE} from '../constants'

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
    const user = this.entities[uid] ||
      await this.reference.child(uid)
        .once('value')
        .then(snapshot => snapshot.val())

    if (!user) return

    const {avatar, email, firstName, lastName, userInfo, online} = user
    return {avatar, email, firstName, lastName, userInfo, uid, online}

  }

  getUser = (userId) => {
    return this.entities[userId]
  }

  @action appendUser = (userId, {chats, ...user}) => {
    user.uid = userId
    // user.key = userId

    this.entities[userId] = {...this.entities[userId], ...user}

  }

  @action refreshUser = async (userId) => {
    const callback = (snapshot) => {
      const user = snapshot.val()

      this.appendUser(userId, user)
    }

    await this.reference
      .child(userId)
      .once('value')
      .then(callback)
  }

  @action fetchPeople = () => {
    if (this.loading) return

    this.loading = true

    const callback = action(snapshot => {
      const users = Object.entries(snapshot.val())
        .reduce((acc, [userId, {chats, ...user}]) => {
          user.uid = userId
          acc[userId] = user
          return acc
        }, {})

      this.entities = {...this.entities, ...users}

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