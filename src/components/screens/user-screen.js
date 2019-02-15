import React, {Component} from 'react'
import UserInfo from '../user-info'
import {inject, observer} from 'mobx-react'
import {PEOPLE_STORE} from '../../constants'
import {observable} from 'mobx'
import Loader from '../common/loader'

@inject(PEOPLE_STORE)
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

  @observable user = null

  async componentWillMount() {
    const userId = this.props.navigation.state.params.user.uid
    await this.props.people.refreshUser(userId)
    this.user = this.props.people.getUser(userId)
  }

  render() {
    if (!this.user) return <Loader/>

    return <UserInfo
      openChatWithUser = {this.openChatWithUser}
      openUserAvatarsScreen = {this.openUserAvatarsScreen}
      openPostScreen = {this.openPostScreen}
      user = {this.user}
    />
  }

  openPostScreen = (postId) => {
    this.props.navigation.push('postScreen', {postId})
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
