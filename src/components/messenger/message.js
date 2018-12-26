import React, {Component, PureComponent} from 'react'
import {View, Text, StyleSheet} from 'react-native'
import {string, shape, array, number} from 'prop-types'
import {WINDOW_WIDTH} from '../../constants'

class Message extends PureComponent {
  static propTypes = {
    message: shape({
      user: shape({
        // name: string.isRequired,
        _id: string.isRequired
      }),
      text: string.isRequired,
      timestamp: number.isRequired,
      key: string.isRequired
    }).isRequired,
    currentUserId: string.isRequired
  }

  render() {
    const {user: {name, _id}, text, timestamp, key} = this.props.message
    const {currentUserId} = this.props
    const isCurrentUser = currentUserId === _id
    // const date = new Date(timestamp).toTimeString().slice(0, 5)


/*
    const renderDate = () => <View>
      <Text selectable style = {[{color: isCurrentUser ? '#E9E9E9' : 'grey'}, styles.text]}>
        {date}
      </Text>
    </View>
*/

    return <View
      // onLayout = {({nativeEvent: {layout: {height}}}) => this.props.message.height = height}
      style = {[styles.container, {
        backgroundColor: isCurrentUser ? '#89F' : '#EEE',
        alignSelf: isCurrentUser ? 'flex-end' : 'flex-start'
      }]}>
      <Text selectable style = {[styles.text, {
        maxWidth: WINDOW_WIDTH - WINDOW_WIDTH / 5,
        color: isCurrentUser ? '#FFF' : '#000'
      }]}>
        {text}
      </Text>
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