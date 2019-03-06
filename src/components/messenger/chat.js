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
import {
  AUTH_STORE, INACTIVE_BACKGROUND_COLOR, MESSENGER_STORE, USER_MESSAGE_COLOR,
  WHITE_BACKGROUND_COLOR, WHITE_TEXT_COLOR
} from '../../constants'
import {string, func, shape, object, any} from 'prop-types'
import EmptyList from '../common/empty-list'
import {reaction} from 'mobx'
import {isIphoneX, getBottomSpace} from 'react-native-iphone-x-helper'
import ListLoader from '../common/list-loader'

// redesign the chat

@inject(MESSENGER_STORE)
@inject(AUTH_STORE)
@observer
class Chat extends Component {
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

  constructor(...args) {
    super(...args)

    reaction(
      () => this.props.messenger.getMessages(this.props.chatId).length,
      () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    )
  }

  componentWillMount() {
    this.props.messenger.subscribeOnMessages(this.props.chatId)
  }

  @observable message = ''
  @action setMessage = message => this.message = message

  // TODO: Make chat computed property
  // TODO: LayoutAnimation onFocus in emptyList

  renderListLoader = () => <View style = {{
    flex: 1,
    height: 60,
    justifyContent: 'center',
    backgroundColor: WHITE_BACKGROUND_COLOR
  }}>
    <ActivityIndicator/>
  </View>

  renderItem = ({item}) => <Message {...item}/>

  renderMessagesList = () => {
    const {messenger, chatId} = this.props

    return <FlatList
      enableEmptySections
      onEndReached = {messenger.fetchMessages.bind(null, chatId)}
      inverted
      initialNumToRender = {Number.MAX_SAFE_INTEGER}
      onEndReachedThreshold = {0.5}
      data = {messenger.getMessages(chatId)}
      renderItem = {this.renderItem}
      ListFooterComponent = {messenger.isChatLoading(chatId) && this.renderListLoader()}
    />
  }

  renderSendButton = () => {
    const InteractiveComponent = this.message ? TouchableOpacity : View

    return <View style = {styles.sendButtonContainer}>
      <InteractiveComponent onPress = {this.sendMessageHandler}>
        <View
          style = {[
            styles.sendButton, {
              backgroundColor: this.message ? USER_MESSAGE_COLOR : INACTIVE_BACKGROUND_COLOR
            }]}>
          <Icon name = 'ios-send' size = {30} color = {WHITE_TEXT_COLOR}/>
        </View>
      </InteractiveComponent>
    </View>
  }

  render() {
    // const {messages, fetchPreviousMessages, currentChatLoading, currentChatLoaded} = this.props.messenger
    // console.log('render chat')
    const {messenger, chatId} = this.props
    // const {uid: currentUserId} = this.props.auth.user
    // TODO Keyboard
    return <SafeAreaView style = {styles.container}>
      {!messenger.getMessages(chatId).length && messenger.isChatLoaded(chatId) ?
        <EmptyList title = {'You have no messages yet...'}/> : this.renderMessagesList()}

      <KeyboardAvoidingView
        behavior = 'padding'
        enabled
        keyboardVerticalOffset = {65 + (isIphoneX() && getBottomSpace())}
      >
        <View style = {styles.sendControlContainer}>

          <View style = {styles.sendMessageContainer}>
            <TextInput
              ref = {ref => this.textInput = ref}
              style = {styles.sendMessageInput}
              value = {this.message}
              placeholder = 'Enter your message here'
              onChangeText = {this.setMessage}
              blurOnSubmit = {false}
              enablesReturnKeyAutomatically
              multiline
            />
          </View>

          {this.renderSendButton()}

        </View>
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
    backgroundColor: WHITE_BACKGROUND_COLOR
  },
  sendControlContainer: {
    display: 'flex',
    flexDirection: 'row',
    maxHeight: 150
  },
  sendMessageContainer: {
    flex: 1,
    paddingVertical: 8,
    paddingLeft: 10,
    justifyContent: 'center'
  },
  sendMessageInput: {
    paddingTop: 0, // multiline flag forcing 'paddingTop: 5'
    fontSize: 16,
    fontWeight: '100'
  },
  sendButtonContainer: {
    justifyContent: 'flex-end',
    padding: 8
  },
  sendButton: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 36,
    width: 36,
    borderRadius: 18
  }
})

export default Chat