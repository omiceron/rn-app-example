import React, {Component, PureComponent} from 'react'
import {Text, StyleSheet} from 'react-native'
import SwipeableCard from '../common/swipeable-card'
import Avatar from '../common/basic-avatar'
import {ROW_HEIGHT} from '../../constants'
import {array, string, func, shape, objectOf, number, object} from 'prop-types'
import {getTime} from '../../stores/utils'
import {inject, observer} from 'mobx-react'

@observer
class ChatCard extends Component {
  static propTypes = {
    chat: shape({
      user: shape({
        avatar: string,
        firstName: string,
        lastName: string
      }).isRequired,
      chatId: string.isRequired,
      messages: object
    }).isRequired,
    currentUserId: string.isRequired,
    openChatScreen: func.isRequired,
    openUserInfoScreen: func.isRequired,
    deleteChat: func.isRequired
  }

  renderAvatar = () => {
    const {chat: {user: {avatar}}} = this.props
    return <Avatar size = {60} /*uri = {avatar}*//>
  }

  renderDate = () => {

    const {chat: {messages}} = this.props
    const arr = Object.values(messages).reverse()
    const [{timestamp}] = arr
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
          lastName
        }
      }
    } = this.props

    if (!messages) return null

    console.log('render chat', firstName)

    const arr = Object.values(messages).reverse()
    // console.log(arr[0])
    const {text, userId: lastMessageSenderId} = arr[0]
    // return null

    const isCurrentUser = currentUserId === lastMessageSenderId

    return <SwipeableCard onPress = {openChatScreen}
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