import React, {Component} from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  LayoutAnimation
} from 'react-native'
import {observer, inject} from 'mobx-react'
import Icon from 'react-native-vector-icons/Ionicons'
import Message from './message'
import {observable, action} from 'mobx'
import {AUTH_STORE, MESSENGER_STORE, USER_MESSAGE_COLOR, WHITE_BACKGROUND_COLOR} from '../../constants'
import {string, func, shape, object, any} from 'prop-types'
import EmptyList from './empty-list'
import {reaction} from 'mobx'
import {isIphoneX, getBottomSpace} from 'react-native-iphone-x-helper'

// redesign the chat

@inject(MESSENGER_STORE)
@inject(AUTH_STORE)
@observer
class Chat extends Component {
  constructor(...args) {
    super(...args)

    reaction(
      () => this.props.messenger.getMessages(this.props.chatId).length,
      () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    )
  }

  static propTypes = {
    // messenger: shape({
    //   sendMessage: func.isRequired,
    //   isChatLoaded: func.isRequired,
    //   isChatLoading: func.isRequired,
    //   getMessages: func.isRequired,
    //   fetchPreviousMessages: func.isRequired
    // }),
    chatId: string.isRequired,
    auth: shape({
      user: object.isRequired
    })
  }

  componentWillMount() {
    this.props.messenger.subscribeOnMessages(this.props.chatId)
  }

  @observable message = ''
  @action setMessage = message => this.message = message


  // TODO: Make chat computed property
  renderMessages = () => {
    const {messenger, chatId} = this.props

    return <FlatList
      enableEmptySections
      onEndReached = {messenger.fetchMessages.bind(null, chatId)}
      inverted
      onEndReachedThreshold = {0.5}
      data = {messenger.getMessages(chatId)}
      renderItem = {({item}) => <Message {...item}/>}
    />
  }

  render() {
    // const {messages, fetchPreviousMessages, currentChatLoading, currentChatLoaded} = this.props.messenger
    // console.log('render chat')
    const {messenger, chatId} = this.props
    // const {uid: currentUserId} = this.props.auth.user

    return <SafeAreaView style = {styles.container}>
      {messenger.isChatLoading(chatId) && <ActivityIndicator/>}
      {!messenger.getMessages(chatId).length && messenger.isChatLoaded(chatId) ?
        <EmptyList/> : this.renderMessages()}

      <KeyboardAvoidingView
        behavior = 'padding'
        enabled
        keyboardVerticalOffset = {65 + (isIphoneX() && getBottomSpace())}
        style = {styles.chatContainer}
      >

        <View style = {styles.messageView}>
          <TextInput
            ref = {ref => this.textInput = ref}
            style = {styles.messageText}
            value = {this.message}
            placeholder = 'Enter your message here'
            onChangeText = {this.setMessage}
            blurOnSubmit = {false}
            enablesReturnKeyAutomatically
            multiline
          />
        </View>

        <TouchableOpacity onPress = {this.sendMessageHandler}>
          <View style = {styles.sendButton}>
            <Icon name = 'ios-send' size = {30} color = {WHITE_BACKGROUND_COLOR}/>
          </View>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>
  }

  sendMessageHandler = () => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    this.props.messenger.sendMessage(this.message, this.props.chatId)
    this.setMessage('')
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: WHITE_BACKGROUND_COLOR
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
    backgroundColor: WHITE_BACKGROUND_COLOR,
    fontSize: 16,
    padding: 10,
    fontWeight: '100'
  },
  sendButton: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: USER_MESSAGE_COLOR,
    height: 36,
    borderRadius: 18,
    width: 36,
    margin: 8,
    padding: 3
  }
})

export default Chat