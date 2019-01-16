import React, {Component, PureComponent} from 'react'
import {Text, StyleSheet} from 'react-native'
import SwipeableCard from '../common/swipeable-card'
import Avatar from '../common/basic-avatar'
import {AUTH_STORE, MESSENGER_STORE, ROW_HEIGHT, USER_STORE} from '../../constants'
import {array, string, func, shape, objectOf, number, object} from 'prop-types'
import {getTime} from '../../stores/utils'
import {inject, observer} from 'mobx-react'

@inject(AUTH_STORE)
@inject(MESSENGER_STORE)
@observer
class ChatCard extends Component {
  static propTypes = {
    // chat: shape({
    user: shape({
      avatar: string,
      firstName: string,
      lastName: string
    }).isRequired,
    chatId: string.isRequired,
    lastMessage: object,
    // messages: object
    // }).isRequired,
    openChatScreen: func.isRequired,
    openUserInfoScreen: func.isRequired,
    deleteChat: func.isRequired
  }

  renderAvatar = () => {
    // const {chat: {user: {avatar}}} = this.props
    return <Avatar size = {60} /*uri = {avatar}*//>
  }

  renderDate = () => {

    // const {DANGER_getLastMessage} = this.props.messenger
    // const {chatId} = this.props.chat
    // const {timestamp} = DANGER_getLastMessage(chatId)

    let {lastMessage} = this.props

    if (!lastMessage) lastMessage = {timestamp: 0}

    const {timestamp} = lastMessage

    // const {chat: {messages: [{timestamp}]}} = this.props

    // const {chat: {messages}} = this.props
    // const arr = Object.values(messages)
    // const {timestamp} = arr[arr.length - 1]
    const date = getTime(timestamp)

    return <Text numberOfLines = {1} style = {styles.text}>
      {date}
    </Text>
  }

  render() {
    let {
      currentUserId,
      openChatScreen,
      openUserInfoScreen,
      deleteChat,
      lastMessage,
      // chat: {
      user,
      chatId,
      // messages,
      user: {
        firstName,
        lastName
      }
      // }
    } = this.props

    // if (!messages) return null
    // if (!lastMessage) return null
    if (!lastMessage) lastMessage = {text: 'a', user}

    // user = {firstName: 'a', lastName: 'b'}
    // console.log('render chat', firstName)

    // const {DANGER_getLastMessage} = this.props.messenger
    // const {text, userId} = DANGER_getLastMessage(chatId)

    const {text, user: userId} = lastMessage

    // const arr = Object.values(messages)
    // const {text, userId: lastMessageSenderId} = arr[arr.length - 1]

    // const [{text, userId: lastMessageSenderId}] = messages

    const isCurrentUser = this.props.auth.user.uid === userId

    return <SwipeableCard onPress = {openChatScreen.bind(null, user)}
                          LeftComponent = {this.renderAvatar}
                          RightComponent = {this.renderDate}
                          onSwipeableLeftOpen = {deleteChat.bind(null, chatId)}
                          leftAction = {openChatScreen.bind(null, user)}
                          rightActionWidth = {ROW_HEIGHT}
                          rightActions = {[
                            {title: 'Info', color: '#C8C7CD', callback: openUserInfoScreen.bind(null, user)},
                            {title: 'Delete', color: '#E67', callback: deleteChat.bind(null, chatId)}
                          ]}
    >
      <Text numberOfLines = {1} style = {styles.title}>
        {firstName} {lastName}
      </Text>
      <Text numberOfLines = {1} style = {styles.text}>
        {isCurrentUser && 'You: '}{text}
      </Text>
    </SwipeableCard>
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'rgba(127,127,127,1)',
    fontSize: 16,
    fontWeight: '100'
  },

  title: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '600'
  }
})

export default ChatCard