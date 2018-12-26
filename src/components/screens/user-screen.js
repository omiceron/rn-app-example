import React, {Component} from 'react'
import UserInfo from '../user-info'
import {inject, observer} from 'mobx-react'
import {FEED_STORE} from '../../constants'

@inject(FEED_STORE)
@observer
class UserScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Info',
    headerStyle: {
      backgroundColor: '#67E',
      borderBottomWidth: 0

    },
    headerTintColor: '#FFF'
  })

  render() {
    return <UserInfo
      openChatWithUser = {this.openChatWithUser}
      openUserAvatarsScreen = {this.openUserAvatarsScreen}
      openPostLikesScreen = {this.openPostLikesScreen}
      user = {this.props.navigation.state.params.user}
    />
  }

  openPostLikesScreen = (postId) => {
    this.props.navigation.push('likesList', {postId})
  }

  openChatWithUser = () => {
    const {user} = this.props.navigation.state.params
    this.props.navigation.push('chatScreen', {user})
  }

  openUserAvatarsScreen = () => {
    const {user} = this.props.navigation.state.params
    this.props.navigation.navigate('userAvatars', {user})
  }

}

export default UserScreen
