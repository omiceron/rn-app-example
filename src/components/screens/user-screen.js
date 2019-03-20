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
  })

  @observable user = null

  async componentDidMount() {
    const {userId} = this.props.navigation.state.params
    this.user = await this.props.people.getUserGreedily(userId)
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

  // TODO: remove user parameter
  openChatWithUser = () => {
    const {userId} = this.props.navigation.state.params
    this.props.navigation.push('chatScreen', {user: this.user, userId})
  }

  openUserAvatarsScreen = () => {
    const {userId} = this.props.navigation.state.params
    this.props.navigation.navigate('userAvatars', {userId})
  }

}

export default UserScreen
