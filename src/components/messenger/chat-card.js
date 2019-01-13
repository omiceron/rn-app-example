import React, {Component, PureComponent} from 'react'
import {Text, StyleSheet} from 'react-native'
import SwipeableCard from '../common/swipeable-card'
import Avatar from '../common/basic-avatar'
import {ROW_HEIGHT} from '../../constants'
import {array, string, func, shape, objectOf, number} from 'prop-types'
import {getTime} from '../../stores/utils'

class ChatCard extends Component {
  static propTypes = {
    chat: shape({
      user: shape({
        avatar: string,
        firstName: string,
        lastName: string,
      }).isRequired,
      chatId: string.isRequired,
      messages: array,
    }).isRequired,
    currentUserId: string.isRequired,
    openChatScreen: func.isRequired,
    openUserInfoScreen: func.isRequired,
    deleteChat: func.isRequired,
  }

  renderAvatar = () => {
    const {chat: {user: {avatar}}} = this.props
    return <Avatar size = {60} /*uri = {avatar}*//>
  }

  renderDate = () => {
    const {chat: {messages: [{timestamp}]}} = this.props
    const date = getTime(timestamp)

    return <Text numberOfLines = {1} style = {styles.text}>
      {date}
    </Text>
  }

  render() {
    const {
      currentUserId,
      openChatScreen,
      openUserInfoScreen,
      deleteChat,
      chat: {
        user,
        chatId,
        messages,
        user: {
          firstName,
          lastName,
        }
      }
    } = this.props

    if (!messages) return null

    const [{text, userId: lastMessageSenderId}] = messages
    const isCurrentUser = currentUserId === lastMessageSenderId

    return <SwipeableCard onPress = {openChatScreen}
      LeftComponent = {this.renderAvatar}
      RightComponent = {this.renderDate}
      onSwipeableLeftOpen = {deleteChat.bind(null, chatId)}
      leftAction = {openChatScreen.bind(null, user)}
      rightActionWidth = {ROW_HEIGHT}
      rightActions = {[
        {title: 'Info', color: '#C8C7CD', callback: openUserInfoScreen.bind(null, user)},
        {title: 'Delete', color: '#E67', callback: deleteChat.bind(null, chatId)},
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
    fontWeight: '100',
  },

  title: {
    marginBottom: 6,
    fontSize: 16,
    fontWeight: '600',
  },
})


export default ChatCard