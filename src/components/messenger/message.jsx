import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { string, bool, shape, array, number, object } from 'prop-types'
import {
    AUTH_STORE,
    MESSAGE_COLOR,
    INACTIVE_TEXT_COLOR,
    BLACK_TEXT_COLOR,
    USER_MESSAGE_COLOR,
    WHITE_BACKGROUND_COLOR,
    IMAGE_SEPARATOR_SIZE,
    MESSAGE_IMAGE_SIZE,
    MESSAGE_BORDER_RADIUS,
    MESSAGE_CONTAINER_WIDTH
} from '../../constants'
import { inject } from 'mobx-react'
import Icon from 'react-native-vector-icons/Ionicons'
import Attachments from '../common/attachments'

@inject(AUTH_STORE)
class Message extends Component {
    static propTypes = {
        userId: string.isRequired,
        text: string.isRequired,
        timestamp: number.isRequired,
        key: string,
        pending: bool,
        attachments: array
    }

    renderStatus = () => (
        <View style={styles.status}>
            <Icon name={`ios-${this.props.pending ? 'checkmark' : 'done-all'}`} color={INACTIVE_TEXT_COLOR} size={30} />
        </View>
    )

    render() {
        const { userId, text, timestamp, pending, attachments } = this.props

        const isCurrentUser = this.props.auth.user.uid === userId

        const containerStyle = [styles.container, { alignSelf: isCurrentUser ? 'flex-end' : 'flex-start' }]

        const messageContainerStyle = [
            styles.messageContainer,
            { backgroundColor: isCurrentUser ? USER_MESSAGE_COLOR : MESSAGE_COLOR }
        ]

        const textStyle = [styles.text, { color: isCurrentUser ? WHITE_BACKGROUND_COLOR : BLACK_TEXT_COLOR }]

        return (
            <View style={containerStyle}>
                {isCurrentUser && this.renderStatus()}
                <View style={messageContainerStyle}>
                    <View style={styles.textContainer}>
                        <Text selectable style={textStyle}>
                            {text}
                        </Text>
                    </View>

                    {attachments && attachments.length ? (
                        <View style={styles.attachmentContainer}>
                            <Attachments
                                maxSize={MESSAGE_IMAGE_SIZE}
                                attachments={attachments}
                                lastRowBottomBorder={MESSAGE_BORDER_RADIUS}
                            />
                        </View>
                    ) : null}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row'
    },
    messageContainer: {
        maxWidth: MESSAGE_CONTAINER_WIDTH,
        borderRadius: MESSAGE_BORDER_RADIUS,
        marginLeft: 8,
        marginRight: 8,
        marginTop: 2,
        marginBottom: 2,
        display: 'flex',
        overflow: 'hidden'
    },
    textContainer: {
        marginHorizontal: 8,
        marginVertical: 8,
        alignItems: 'flex-end'
    },
    attachmentContainer: {
        display: 'flex',
        padding: IMAGE_SEPARATOR_SIZE
    },
    text: {
        fontSize: 16,
        fontWeight: '100'
    },
    status: {
        alignSelf: 'flex-end',
        justifyContent: 'center',
        marginLeft: 8,
        marginTop: 2
    }
})

export default Message
