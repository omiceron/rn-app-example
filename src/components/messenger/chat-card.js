import React, {Component, PureComponent} from 'react'
import {Text, StyleSheet, View} from 'react-native'
import SwipeableCard from '../common/swipeable-card'
import Avatar from '../common/basic-avatar'
import {AUTH_STORE, MESSENGER_STORE, ROW_HEIGHT, USER_STORE} from '../../constants'
import {array, string, func, shape, objectOf, number, object} from 'prop-types'
import {getTime} from '../../stores/utils'
import {inject, observer} from 'mobx-react'
import {observable, action} from 'mobx'
import SegmentedCard from '../common/segmented-card'

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

  @observable isArchived = false
  @action setArchived = () => this.isArchived = true

  renderAvatar = () => {
    // const {chat: {user: {avatar}}} = this.props
    return <Avatar size = {60} /*uri = {avatar}*//>
  }

  renderDate = () => {
    const date = getTime(this.props.lastMessage.timestamp)

    return <Text numberOfLines = {1} style = {styles.text}>
      {date}
    </Text>
  }

  onLeftOpen = () => {
    this.setArchived()
    // TODO: This is not good
    setTimeout(() => this.props.messenger.archiveChat(this.props.chatId), 1)
  }

  render() {
    let {
      currentUserId,
      openChatScreen,
      openUserInfoScreen,
      deleteChat,
      lastMessage,
      // chat: {
      chatId,
      // messages,
      user: {
        firstName,
        lastName,
        uid: userId
      }
      // }
    } = this.props

    console.log('render chat', firstName)

    const {text, user: lastMessageUserId} = lastMessage
    const isCurrentUser = userId === lastMessageUserId

    if (this.isArchived) return <View style = {{backgroundColor: '#497AFC', height: 76}}/>

    return <SwipeableCard
      onPress = {openChatScreen.bind(null, userId)}
      LeftComponent = {this.renderAvatar}
      RightComponent = {this.renderDate}
      onSwipeableLeftOpen = {this.onLeftOpen}
      leftAction = {openChatScreen.bind(null, userId)}
      rightActionWidth = {ROW_HEIGHT}
      rightActions = {[
        {title: 'Info', color: '#C8C7CD', callback: openUserInfoScreen.bind(null, userId)},
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