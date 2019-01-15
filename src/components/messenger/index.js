import React, {Component} from 'react'
import {
  StyleSheet, FlatList, SafeAreaView
} from 'react-native'
import {observer, inject} from 'mobx-react'
import ChatCard from './chat-card'
import Separator from '../common/separator'
import {AUTH_STORE, MESSENGER_STORE, WHITE_BACKGROUND_COLOR} from '../../constants'
import {array, string, func, shape} from 'prop-types'

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
      deleteChat,
      auth: {
        user: {
          uid: currentUserId
        }
      }
    } = this.props

    return <ChatCard currentUserId = {currentUserId}
                     openUserInfoScreen = {openUserInfoScreen}
                     openChatScreen = {openChatScreen.bind(null, item.user)}
                     deleteChat = {deleteChat}
                     chat = {item}/>
  }

  render() {
    const {messenger} = this.props

    return <SafeAreaView style = {styles.container}>
      <FlatList ItemSeparatorComponent = {() => <Separator leftIndent = {78}/>}
                data = {messenger.DANGER_orderedChats}
                renderItem = {this.renderChatCard}/>
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