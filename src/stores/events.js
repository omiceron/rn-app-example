import EntitiesStore, { loadAllHelper } from './entities-store'
import { action, computed } from 'mobx'
import groupBy from 'lodash/groupBy'
import firebase from 'firebase'

import { entitiesFromFB } from './utils'

class Events extends EntitiesStore {
    @computed
    get sections() {
        const remapped = this.list.map((event) => ({ ...event, initials: 'AA', color: this.color }))
        const grouped = groupBy(remapped, (event) => event.title[0].toUpperCase())

        return Object.entries(grouped)
            .map(([letter, list]) => ({
                title: `${letter}`,
                data: list.map((event) => ({ key: event.uid, event }))
            }))
            .sort((a, b) => a.title > b.title)
    }

    @action getSections = (list) => {
        const remapped = list.map((event) => ({ ...event, initials: 'AA', color: this.color }))
        const grouped = groupBy(remapped, (event) => event.title[0].toUpperCase())

        return Object.entries(grouped).map(([letter, list]) => ({
            title: `${letter}`,
            data: list.map((event) => ({ key: event.uid, event }))
        })) //.sort((a, b) => a.title > b.title)
    }

    initials({ title }) {
        const names = title.toUpperCase().split(/\W+/)
        if (names.length < 2) {
            return names[0][0]
        } else {
            return names[0][0] + names[1][0]
        }
    }

    get color() {
        return '#' + Math.random().toString(16).slice(2, 8)
    }

    @action loadAll = () => {
        this.loading = true

        firebase
            .database()
            .ref('events')
            .limitToLast(10)
            .once(
                'value',
                action((data) => {
                    this.entities = entitiesFromFB(data.val())
                    // this.sections = this.getSections(Object.values(this.entities))
                    this.loading = false
                    this.loaded = true
                })
            )
    }

    // @action loadAll = loadAllHelper('events')
}

export default Events
