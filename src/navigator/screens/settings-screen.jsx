import React, {Component} from 'react'
import Settings from '../../components/settings'
import {observer, inject} from 'mobx-react'
import {WHITE_TEXT_COLOR, CURRENT_USER_STORE, WARNING_COLOR} from '../../constants'
import Loader from '../../components/ui/loader'

@inject(CURRENT_USER_STORE)
@observer
class SettingsScreen extends Component {
    static navigationOptions = () => ({
        title: 'Settings',
        tabBarOptions: {
            activeTintColor: WARNING_COLOR,
            showLabel: false
        },
        headerStyle: {
            backgroundColor: WARNING_COLOR,
            borderBottomWidth: 0
        },
        headerTintColor: WHITE_TEXT_COLOR
    })

    render() {
        return this.props.currentUser.size ? <Settings /> : <Loader />
    }

    // render() {
    //   return this.props.currentUser.loaded ? <Settings /*onPress = {this.handlePress}*//> : <Loader/>
    // }
    // handlePress = () => {
    //   this.props.navigation.navigate('userPhoto')
    // }
}

export default SettingsScreen
