import {NavigationActions, StackActions} from 'react-navigation'
import {autorun} from 'mobx'
import BasicStore from './basic-store'
import {AUTH_STORE} from '../constants'
import {AsyncStorage} from 'react-native'

export default class NavigationStore extends BasicStore {
    onInit() {
        autorun(() => {
            const {user} = this.getStore(AUTH_STORE)
            // this.navigate(user ? 'app' : 'signIn')
        })
    }

    setRef = (ref) => {
        this.ref = ref
        if (ref) this.onInit()
    }

    navigate = (routeName, params) =>
        this.ref.dispatch(
            NavigationActions.navigate({
                routeName,
                params
            })
        )

    push = (routeName, params) => {
        this.ref.dispatch(
            StackActions.push({
                routeName,
                params
            })
        )
    }

    reset = (to) =>
        this.ref.dispatch(
            StackActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({
                        routeName: to
                    })
                ]
            })
        )

    goBack = () => {
        this.ref.dispatch(NavigationActions.back())
    }
}
