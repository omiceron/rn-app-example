import React, {Component} from 'react'
import Settings from '../settings'

import {observer, inject} from 'mobx-react'
import {AUTH_STORE, NAVIGATION_TINT_COLOR, USER_STORE, WARNING_COLOR, WHITE_BACKGROUND_COLOR} from '../../constants'
import Loader from '../common/loader'

@inject(AUTH_STORE)
@inject(USER_STORE)
@observer
class SettingsScreen extends Component {

  static navigationOptions = ({navigation}) => ({
    title: 'Settings',
    tabBarOptions: {
      activeTintColor: WARNING_COLOR,
      showLabel: false
    },
    headerStyle: {
      backgroundColor: WARNING_COLOR,
      borderBottomWidth: 0
    },
    headerTintColor: NAVIGATION_TINT_COLOR
  })

  render() {
    return this.props.user.loaded ? <Settings /*onPress = {this.handlePress}*//> : <Loader/>
  }

  // handlePress = () => {
  //   this.props.navigation.navigate('userPhoto')
  // }

}

export default SettingsScreen
