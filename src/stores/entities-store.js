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
        this.lastEntityKey = null
    }

    @computed
    get size() {
        return Object.keys(this.entities).length
    }

    cache = async (obj) => {
        // console.log('cached!')
        return await AsyncStorage.setItem(`meowchat:store:${this.storeName}`, JSON.stringify(toJS(obj)))
    }

    cacheEntities = async () => {
        console.log('CACHE:', 'cache entities from store', this.storeName)
        return await this.cache(this.entities)
    }

    @action retrieveCachedEntities = async () => {
        console.log('CACHE:', 'get entities from store', this.storeName)
        const cachedEntities = await AsyncStorage.getItem(`meowchat:store:${this.storeName}`).then(JSON.parse)

        if (!cachedEntities) {
            console.log('CACHE:', 'no cached entities from store', this.storeName)
            return
        }

        this.entities = cachedEntities

        return cachedEntities
    }

    @observable lastEntityKey = null

    @action fetchEntities = async (
        getReference,
        setEntities,
        storeChunkLength = 0,
        context = this,
        chunkFilter = () => true,
        getLastKey = (payload) => Object.keys(payload)[0]
    ) => {
        if (context.loaded || context.loading || !this.user) return

        console.log(this.storeName.toUpperCase(), ': fetching entities', 'start')

        context.loading = true

        const chunkShift = context.lastEntityKey ? 1 : 0
        const chunkLength = storeChunkLength + chunkShift

        const callback = action(async (snapshot) => {
            const payload = snapshot.val() || {}

            const currentChunkLength = Object.entries(payload).filter(chunkFilter).length
            const isEmpty = currentChunkLength === chunkShift

            context.lastEntityKey = getLastKey(payload, context)

            !isEmpty && (await setEntities(payload))

            context.loaded = isEmpty || currentChunkLength < chunkLength
            context.loading = false

            return true
        })

        let ref = getReference()

        if (storeChunkLength) {
            ref = ref.limitToLast(chunkLength)
        }

        if (context.lastEntityKey) {
            ref = ref.endAt(context.lastEntityKey)
        }

        return await ref.once('value').then(callback)
    }
}

export function loadAllHelper(refName) {
    return action(function () {
        this.loading = true
        console.log(refName)

        firebase
            .database()
            .ref(refName)
            .once(
                'value',
                action((data) => {
                    this.entities = entitiesFromFB(data.val())
                    this.loading = false
                    this.loaded = true
                })
            )
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
