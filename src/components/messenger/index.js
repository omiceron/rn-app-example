import React, {Component} from 'react'
import {
  StyleSheet, FlatList, SafeAreaView, ActivityIndicator,
} from 'react-native'
import {observer, inject} from 'mobx-react'
import ChatCard from './chat-card'
import Separator from '../common/separator'
import {AUTH_STORE, MESSENGER_STORE, WHITE_BACKGROUND_COLOR} from '../../constants'
import {array, string, func, shape} from 'prop-types'
import EmptyList from './empty-list'

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
      // orderedChats: array.isRequired
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

  render() {
    const {messenger} = this.props
    const chats = messenger.DANGER_orderedChats

    if (!chats.length) return <EmptyList/>
    return <SafeAreaView style = {styles.container}>
      <FlatList
        ItemSeparatorComponent = {() => <Separator leftIndent = {78}/>}
        data = {chats}
        renderItem = {this.renderChatCard}
        onEndReached = {messenger.DANGER_fetchChats}
        onEndReachedThreshold = {0.1}
      />
      {messenger.loading && <ActivityIndicator/>}
    </SafeAreaView>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE_BACKGROUND_COLOR
  }
})

export default Messenger