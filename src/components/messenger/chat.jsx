import React, {Component} from 'react'
import {
    View,
    TextInput,
    KeyboardAvoidingView,
    StyleSheet,
    FlatList,
    SafeAreaView,
    LayoutAnimation,
    ActionSheetIOS
} from 'react-native'

import {observer, inject} from 'mobx-react'
import Message from './message'
import {observable, action} from 'mobx'
import {string, func, shape, object, any} from 'prop-types'
import EmptyList from '../ui/empty-list'
import {reaction, computed} from 'mobx'
import {isIphoneX, getBottomSpace} from 'react-native-iphone-x-helper'

import {AUTH_STORE, MESSENGER_STORE, WHITE_BACKGROUND_COLOR} from '../../constants'

import ListLoader from '../ui/list-loader'
import AttachedImagesRow from '../ui/attachments/attached-images-row'
import ChatButton from './chat-button'

// TODO: redesign the chat
// TODO: Make chat computed property
// TODO: LayoutAnimation onFocus in emptyList
// TODO Keyboard

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

        this.stopReactionOnMessages = reaction(
            () => this.messages.length,
            () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        )

        this.stopReactionOnAttachments = reaction(
            () => this.tempAttachments.length,
            () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        )
    }

    componentDidMount() {
        this.props.messenger.subscribeOnMessages(this.props.chatId)
    }

    componentWillUnmount() {
        this.stopReactionOnAttachments()
        this.stopReactionOnMessages()
        this.props.messenger.deleteAttachments(this.props.chatId)
    }

    @computed get tempAttachments() {
        return this.props.messenger.getTempAttachments(this.props.chatId)
    }

    @computed get messages() {
        return this.props.messenger.getMessages(this.props.chatId)
    }

    @observable message = ''
    @action setMessage = (message) => (this.message = message)

    renderItem = ({item}) => <Message {...item} />

    renderMessagesList = () => {
        const {messenger, chatId} = this.props

        return (
            <FlatList
                enableEmptySections
                onEndReached={messenger.fetchMessages.bind(null, chatId)}
                inverted
                initialNumToRender={Number.MAX_SAFE_INTEGER}
                onEndReachedThreshold={0.5}
                data={this.messages}
                renderItem={this.renderItem}
                ListFooterComponent={messenger.isChatLoading(chatId) && <ListLoader style={styles.loader} />}
            />
        )
    }

    render() {
        const {messenger, chatId} = this.props
        return (
            <SafeAreaView style={styles.container}>
                {!this.messages.length && messenger.isChatLoaded(chatId) ? (
                    <EmptyList title={'You have no messages yet...'} />
                ) : (
                    this.renderMessagesList()
                )}

                <KeyboardAvoidingView
                    behavior="padding"
                    enabled
                    keyboardVerticalOffset={60 + (isIphoneX() && getBottomSpace())}
                >
                    <View style={styles.controlContainer}>
                        {this.tempAttachments.length ? (
                            <View style={{padding: 8}}>
                                <AttachedImagesRow attachments={this.tempAttachments} />
                            </View>
                        ) : null}

                        <View style={styles.sendControlContainer}>
                            <ChatButton
                                icon="ios-attach"
                                onPress={this.attachHandler}
                                isActive={this.tempAttachments.length < 10}
                            />
                            <View style={styles.sendMessageContainer}>
                                <TextInput
                                    ref={this.setTextInputRef}
                                    style={styles.sendMessageInput}
                                    value={this.message}
                                    placeholder="Enter your message here"
                                    onChangeText={this.setMessage}
                                    blurOnSubmit={false}
                                    enablesReturnKeyAutomatically
                                    multiline
                                />
                            </View>
                            <ChatButton
                                icon="ios-send"
                                onPress={this.sendMessageHandler}
                                isActive={
                                    this
                                        .message /*|| this.tempAttachments.length && this.tempAttachments.every(file => file.loaded)*/
                                }
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        )
    }

    setTextInputRef = (ref) => (this.textInput = ref)

    sendMessageHandler = () => {
        this.props.messenger.sendMessage(this.message, this.props.chatId)
        this.setMessage('')
    }

    attachHandler = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Choose photo from gallery', 'Take snapshot'],
                cancelButtonIndex: 0
            },
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    this.props.messenger.attachImageHandler(this.props.chatId)
                }
                if (buttonIndex === 2) {
                    this.props.messenger.attachPhotoHandler(this.props.chatId)
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
        fontWeight: '300'
    },
    loader: {
        backgroundColor: WHITE_BACKGROUND_COLOR
    }
})

export default Chat
