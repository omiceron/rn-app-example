import React, {Component} from 'react'
import Messenger from '../messenger/index'
import {inject, observer} from 'mobx-react'
import {MESSENGER_STORE, PEOPLE_STORE} from '../../constants'
import Loader from '../common/loader'
import {LayoutAnimation, ActionSheetIOS} from 'react-native'
import {reaction} from 'mobx'

@inject(PEOPLE_STORE)
@inject(MESSENGER_STORE)
@observer
class MessengerScreen extends Component {
  constructor(...args) {
    super(...args)

    reaction(
      () => this.props.messenger.size,
      () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    )
  }

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

  openChatScreen = (userId) => {
    // TODO: remove user parameter
    const user = this.props.people.getUser(userId)
    this.props.navigation.navigate('chatScreen', {user, userId})
  }

  openUserInfoScreen = (userId) => {
    this.props.navigation.push('userScreen', {userId})
  }

  deleteChat = (chatId) => {
    ActionSheetIOS.showActionSheetWithOptions({
        title: 'Are you sure you want to delete this chat?',
        options: ['Cancel', 'Delete'],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 0
      }, (buttonIndex) => {
        if (buttonIndex === 1) {
          this.props.messenger.deleteChat(chatId)
        }
      }
    )
  }

}

export default MessengerScreen
