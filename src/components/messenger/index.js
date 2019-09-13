import React, {Component} from 'react'
import {
  StyleSheet, FlatList, SafeAreaView, ActivityIndicator, View
} from 'react-native'
import {observer, inject} from 'mobx-react'
import ChatCard from './chat-card'
import {AUTH_STORE, INACTIVE_BACKGROUND_COLOR, MESSENGER_STORE, WHITE_BACKGROUND_COLOR} from '../../constants'
import {array, string, func, shape} from 'prop-types'
import EmptyList from '../common/empty-list'
import ListLoader from '../common/list-loader'
import LinedSeparator from '../common/separator/lined-separator'

@inject(MESSENGER_STORE)
@inject(AUTH_STORE)
@observer
class Messenger extends Component {
  static propTypes = {
    openChatScreen: func.isRequired,
    openUserInfoScreen: func.isRequired,
    deleteChat: func.isRequired,
    auth: shape({
      user: shape({
        uid: string.isRequired
      })
    }),
    messenger: shape({
      // chats: array.isRequired
    })
  }

  renderChatCard = ({item}) => {
    const {
      openChatScreen,
      openUserInfoScreen,
      deleteChat
    } = this.props

    return <ChatCard
      openUserInfoScreen = {openUserInfoScreen}
      openChatScreen = {openChatScreen}
      deleteChat = {deleteChat}
      chatId = {item.chatId}
      lastMessage = {item.lastMessage}
      user = {item.user}
    />
  }

  renderSeparator = () => <LinedSeparator style = {styles.messengerSeparator}/>

  render() {
    const {messenger} = this.props
    const chats = messenger.chats

    if (!chats.length) return <EmptyList title = {'You have no chats yet...'}/>
    return <SafeAreaView style = {styles.container}>
      <FlatList
        contentContainerStyle = {{backgroundColor: WHITE_BACKGROUND_COLOR}}
        ItemSeparatorComponent = {this.renderSeparator}
        data = {chats}
        renderItem = {this.renderChatCard}
        onEndReached = {messenger.fetchChats}
        onEndReachedThreshold = {0.1}
        ListFooterComponent = {messenger.loading && ListLoader}
      />
    </SafeAreaView>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: INACTIVE_BACKGROUND_COLOR
  },
  messengerSeparator: {
    marginLeft: 78,
  }
})

export default Messenger
