import React, {Component} from 'react'
import Settings from '../settings'

import {observer, inject} from 'mobx-react'
import {AUTH_STORE, USER_STORE} from '../../constants'
import Loader from '../common/loader'

@inject(AUTH_STORE)
@inject(USER_STORE)
@observer
class SettingsScreen extends Component {

  static navigationOptions = ({navigation}) => ({
    title: 'Settings',
    tabBarOptions: {
      activeTintColor: '#E67',
      showLabel: false
    },
    headerStyle: {
      backgroundColor: '#E67',
      borderBottomWidth: 0
    },
    headerTintColor: '#FFF'
  })

  render() {
    return this.props.user.loaded ? <Settings /*onPress = {this.handlePress}*//> : <Loader/>
  }

  // handlePress = () => {
  //   this.props.navigation.navigate('userPhoto')
  // }

}

export default SettingsScreen
