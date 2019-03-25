import React, {Component, PureComponent} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {string, bool, shape, array, number, object} from 'prop-types'
import {
  AUTH_STORE,
  MESSAGE_COLOR,
  INACTIVE_TEXT_COLOR,
  BLACK_TEXT_COLOR,
  USER_MESSAGE_COLOR,
  WHITE_BACKGROUND_COLOR,
  WINDOW_WIDTH
} from '../../constants'
import {inject} from 'mobx-react'
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

  renderStatus = () => <View style = {styles.status}>
    <Icon
      name = {`ios-${this.props.pending ? 'checkmark' : 'done-all'}`}
      color = {INACTIVE_TEXT_COLOR}
      size = {30}/>
  </View>

  render() {
    const {userId, text, timestamp, pending, attachments} = this.props
    const isCurrentUser = this.props.auth.user.uid === userId

    return <View style = {[styles.container, {alignSelf: isCurrentUser ? 'flex-end' : 'flex-start'}]}>
      {isCurrentUser && this.renderStatus()}
      <View style = {[styles.messageContainer, {backgroundColor: isCurrentUser ? USER_MESSAGE_COLOR : MESSAGE_COLOR}]}>

        <View style = {styles.textContainer}>
          <Text selectable style = {[styles.text, {color: isCurrentUser ? WHITE_BACKGROUND_COLOR : BLACK_TEXT_COLOR}]}>
            {text}
          </Text>
        </View>

        <View style = {styles.textContainer}>
          {attachments && attachments.length ?
            <Attachments style = {styles.textContainer} attachments = {attachments}/> : null}
        </View>
      </View>
    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  messageContainer: {
    borderRadius: 12,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 2,
    marginBottom: 2,
    display: 'flex',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  textContainer: {
    maxWidth: WINDOW_WIDTH - WINDOW_WIDTH / 5,
    alignItems: 'flex-end'
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