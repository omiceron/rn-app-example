import React, {Component} from 'react'
import Settings from '../settings'

import {observer, inject} from 'mobx-react'
import {AUTH_STORE} from "../../constants/index";

@inject(AUTH_STORE)
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
      borderBottomWidth: 0,
    },
    headerTintColor: '#FFF',
  })

  render() {
    return <Settings /*onPress = {this.handlePress}*//>
  }

  // handlePress = () => {
  //   this.props.navigation.navigate('userPhoto')
  // }

}

export default SettingsScreen
