import React, {Component, PureComponent} from 'react'
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import {string, bool, shape, array, number} from 'prop-types'
import {
  ACTIVE_TINT_COLOR, AUTH_STORE, DEFAULT_HEADER_COLOR, MESSAGE_COLOR, INACTIVE_TEXT_COLOR, BLACK_TEXT_COLOR,
  USER_MESSAGE_COLOR,
  WHITE_BACKGROUND_COLOR,
  WINDOW_WIDTH
} from '../../constants'
import {observer, inject} from 'mobx-react'
import Icon from 'react-native-vector-icons/Ionicons'

@inject(AUTH_STORE)
class Message extends PureComponent {
  static propTypes = {
    userId: string.isRequired,
    text: string.isRequired,
    timestamp: number.isRequired,
    key: string,
    pending: bool
  }

  renderStatus = () => <View style = {{
      justifyContent: 'center',
      marginLeft: 8,
      marginTop: 2,
    }}>
      <Icon
        name = {`ios-${this.props.pending ? 'checkmark' : 'done-all'}`}
        color = {INACTIVE_TEXT_COLOR}
        size = {30}/>
    </View>

  render() {
    const {userId, text, timestamp, pending} = this.props
    const isCurrentUser = this.props.auth.user.uid === userId
    // const date = new Date(timestamp).toTimeString().slice(0, 5)

    /*
        const renderDate = () => <View>
          <Text selectable style = {[{color: isCurrentUser ? '#E9E9E9' : 'grey'}, styles.text]}>
            {date}
          </Text>
        </View>
    */

    return <View style = {{
      flex: 1,
      alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
      flexDirection: 'row'
    }}>
      {/*{pending && <ActivityIndicator/>}*/}
      {isCurrentUser && this.renderStatus()}
      <View
        // onLayout = {({nativeEvent: {layout: {height}}}) => this.props.message.height = height}
        style = {[styles.container, {
          backgroundColor: isCurrentUser ? USER_MESSAGE_COLOR : MESSAGE_COLOR
        }]}>
        <Text selectable style = {[styles.text, {
          maxWidth: WINDOW_WIDTH - WINDOW_WIDTH / 5,
          color: isCurrentUser ? WHITE_BACKGROUND_COLOR : BLACK_TEXT_COLOR
        }]}>
          {text}
        </Text>
      </View>
    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginLeft: 8,
    marginRight: 8,
    marginTop: 2,
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  text: {
    fontSize: 16,
    fontWeight: '100'
  }
})

export default Message