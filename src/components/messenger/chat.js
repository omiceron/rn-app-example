import React, {Component} from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  SafeAreaView
} from 'react-native'
import {observer, inject} from 'mobx-react'
import Icon from 'react-native-vector-icons/Ionicons'
import Message from './message'
import {observable, action} from 'mobx'
import {AUTH_STORE, MESSENGER_STORE} from '../../constants'
import {string, func, shape, object, any} from 'prop-types'

// redesign the chat

@inject(MESSENGER_STORE)
@inject(AUTH_STORE)
@observer
class Chat extends Component {
  static propTypes = {
    messenger: shape({
      sendMessage: func.isRequired,
      isChatLoaded: func.isRequired,
      isChatLoading: func.isRequired,
      getMessages: func.isRequired,
      fetchPreviousMessages: func.isRequired
    }),
    chatId: string.isRequired,
    auth: shape({
      user: object.isRequired
    })
  }

  @observable message = ''
  @action setMessage = message => this.message = message

  renderLoader = () => {
    const {messenger: {isChatLoaded, isChatLoading}, chatId} = this.props

    return isChatLoaded(chatId) || isChatLoading(chatId) && <ActivityIndicator/>
  }

  render() {
    // const {messages, fetchPreviousMessages, currentChatLoading, currentChatLoaded} = this.props.messenger
    // console.log('render chat')
    const {messenger: {getMessages, fetchPreviousMessages}, chatId} = this.props
    const {uid: currentUserId} = this.props.auth.user

    return <SafeAreaView style = {styles.container}>
      {this.renderLoader()}

      <FlatList
        enableEmptySections
        onEndReached = {fetchPreviousMessages.bind(null, chatId)}
        inverted
        initialNumToRender = {15}
        onEndReachedThreshold = {0.1}
        data = {getMessages(chatId)}
        renderItem = {({item}) => <Message currentUserId = {currentUserId} message = {item}/>}
        // data = {messages}
        // onEndReached = {fetchPreviousMessages}
        // automaticallyAdjustContentInsets = {false}
      />

      <KeyboardAvoidingView behavior = 'padding'
                            enabled
                            keyboardVerticalOffset = {65}
                            style = {styles.chatContainer}>

        <View style = {styles.messageView}>
          <TextInput ref = {ref => this.textInput = ref}
                     style = {styles.messageText}
                     value = {this.message}
                     placeholder = 'Enter your message here'
                     onChangeText = {this.setMessage}
                     blurOnSubmit = {false}
                     enablesReturnKeyAutomatically
                     multiline/>
        </View>

        <TouchableOpacity onPress = {this.sendMessageHandler}>
          <View style = {styles.sendButton}>
            <Icon name = 'ios-send' size = {30} color = {'white'}/>
          </View>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  }

  sendMessageHandler = () => {
    this.props.messenger.sendMessage(this.message, this.props.chatId)
    this.setMessage('')
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  messageView: {
    maxHeight: 200,
    flex: 5
  },
  messageText: {
    backgroundColor: 'white',
    fontSize: 16,
    padding: 10,
    fontWeight: '100'
  },
  sendButton: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#67E',
    height: 36,
    borderRadius: 18,
    width: 36,
    margin: 8,
    padding: 3
  }
})

export default Chat