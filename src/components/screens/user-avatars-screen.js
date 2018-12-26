import React, {Component} from 'react'
import SlideShow from '../common/slide-show'
import {StatusBar} from 'react-native'

class UserAvatarsScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null
  })

  componentWillMount() {
    StatusBar.setHidden(true, 'fade')
  }

  componentWillUnmount() {
    StatusBar.setHidden(false, 'fade')
  }

  render() {
    return <SlideShow
      onPress = {this.handlePress}
      // uri = {this.props.navigation.state.params.user.avatar}
    />
  }

  handlePress = () => {
    this.props.navigation.goBack()
    // StatusBar.setHidden(false, 'slide')

  }
}

export default UserAvatarsScreen