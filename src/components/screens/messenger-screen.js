import React, {Component} from 'react'
import Messenger from '../messenger/index'
import {inject, observer} from 'mobx-react'
import {MESSENGER_STORE} from '../../constants'
import Loader from '../common/loader'

@inject(MESSENGER_STORE)
@observer
class MessengerScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'Chats',
    headerStyle: {
      backgroundColor: '#67E',
      borderBottomWidth: 0
    },
    headerTintColor: '#FFF'
  })

  render() {
    const {loading, loaded, size} = this.props.messenger

    if (size <= 1 && (!loaded || loading)) return <Loader/>

    return <Messenger
      openUserInfoScreen = {this.openUserInfoScreen}
      openChatScreen = {this.openChatScreen}
      deleteChat = {this.deleteChat}
    />
  }

  openChatScreen = (user) => {
    this.props.navigation.navigate('chatScreen', {user})
  }

  openUserInfoScreen = (user) => {
    this.props.navigation.push('userScreen', {user})
  }

  deleteChat = (chatId) => {
    this.props.messenger.deleteChat(chatId)
  }

}

export default MessengerScreen
