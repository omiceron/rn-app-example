import React, {Component} from 'react'
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  FlatList,
  SafeAreaView,
  LayoutAnimation,
  ActionSheetIOS,
  StatusBar
} from 'react-native'
import {observer, inject} from 'mobx-react'
import Message from './message'
import {observable, action, computed} from 'mobx'
import {
  ATTACHMENTS_STORE,
  AUTH_STORE, MESSENGER_STORE,
  WHITE_BACKGROUND_COLOR
} from '../../constants'
import {string, func, shape, object, any} from 'prop-types'
import EmptyList from '../common/empty-list'
import {reaction} from 'mobx'
import {isIphoneX, getBottomSpace} from 'react-native-iphone-x-helper'
import ListLoader from '../common/list-loader'
import {ImagePicker} from 'expo'
import AttachmentsList from './attachments-list'
import ChatButton from './chat-button'

// redesign the chat
// TODO: Make chat computed property
// TODO: LayoutAnimation onFocus in emptyList
// TODO Keyboard

@inject(ATTACHMENTS_STORE)
@inject(MESSENGER_STORE)
@inject(AUTH_STORE)
@observer
class Chat extends Component {
  static propTypes = {
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

    reaction(
      () => this.list.length,
      () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    )
  }

  componentWillMount() {
    this.props.messenger.subscribeOnMessages(this.props.chatId)
  }

  componentWillUnmount() {
    // TODO: not the best practice but ok
    this.attachments.forEach(this.props.attachments.deleteAttachment)
  }

  @observable message = ''
  @action setMessage = message => this.message = message

  @observable attachments = []
  @action clearAttachments = () => this.attachments = []

  @computed
  get list() {
    return this.attachments.map(this.props.attachments.getAttachment)
  }

  @action attachFile = async ({uri, cancelled}) => {
    if (cancelled) return

    const attachFile = this.props.attachments.attachFileSequence({uri})
    const {value: uid} = await attachFile.next()
    this.attachments = [...this.attachments, uid]
    attachFile.next()
  }

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
      ListFooterComponent = {messenger.isChatLoading(chatId) && <ListLoader style = {styles.loader}/>}
    />
  }

  render() {
    const {messenger, chatId} = this.props
    return <SafeAreaView style = {styles.container}>
      {!messenger.getMessages(chatId).length && messenger.isChatLoaded(chatId) ?
        <EmptyList title = {'You have no messages yet...'}/> : this.renderMessagesList()}

      <KeyboardAvoidingView
        behavior = 'padding'
        enabled
        keyboardVerticalOffset = {60 + (isIphoneX() && getBottomSpace())}
      >
        <View style = {styles.controlContainer}>

          {this.list.length ? <AttachmentsList attachments = {this.list}/> : null}

          <View style = {styles.sendControlContainer}>
            <ChatButton icon = 'ios-attach' onPress = {this.attachHandler} isActive = {this.list.length < 10}/>
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
            <ChatButton
              icon = 'ios-send'
              onPress = {this.sendMessageHandler}
              isActive = {this.message /*|| this.list.length && this.list.every(file => file.loaded)*/}/>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  }

  sendMessageHandler = () => {
    this.props.messenger.sendMessage(this.message, this.props.chatId, this.list)
    this.setMessage('')
    this.clearAttachments()
  }

  attachHandler = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Choose photo from gallery', 'Take snapshot'],
        cancelButtonIndex: 0
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          StatusBar.setBarStyle('default', true)

          const photo = await ImagePicker.launchImageLibraryAsync()
            .catch(console.warn)

          this.attachFile(photo)

          StatusBar.setBarStyle('light-content', true)

        }
        if (buttonIndex === 2) {
          StatusBar.setBarStyle('default', true)

          const photo = await ImagePicker.launchCameraAsync()
            .catch(console.warn)

          this.attachFile(photo)

          StatusBar.setBarStyle('light-content', true)

        }

      }
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE_BACKGROUND_COLOR
  },
  controlContainer: {
    // flex: 1,
    display: 'flex'
  },
  sendControlContainer: {
    display: 'flex',
    flexDirection: 'row',
    maxHeight: 150
  },
  sendMessageContainer: {
    flex: 1,
    paddingVertical: 8,
    // paddingLeft: 10,
    justifyContent: 'center'
  },
  sendMessageInput: {
    paddingTop: 0, // multiline flag forcing 'paddingTop: 5'
    fontSize: 16,
    fontWeight: '100'
  },
  loader: {
    backgroundColor: WHITE_BACKGROUND_COLOR
  }
})

export default Chat