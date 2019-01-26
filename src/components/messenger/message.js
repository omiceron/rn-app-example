import React, {Component, PureComponent} from 'react'
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native'
import {string, bool, shape, array, number} from 'prop-types'
import {AUTH_STORE, WINDOW_WIDTH} from '../../constants'
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
      alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
      flexDirection: 'row'
    }}>
      {/*{pending && <ActivityIndicator/>}*/}
      {isCurrentUser && <View style = {{
        justifyContent: 'center',
        marginLeft: 8,
        marginTop: 2,
      }}>
        <Icon
          name = {`ios-${pending ? 'checkmark' : 'done-all'}`}
          color = '#CCCCCC'
          size = {30}/>
      </View>}
      <View
        // onLayout = {({nativeEvent: {layout: {height}}}) => this.props.message.height = height}
        style = {[styles.container, {
          backgroundColor: isCurrentUser ? '#89F' : '#EEE'
        }]}>
        <Text selectable style = {[styles.text, {
          maxWidth: WINDOW_WIDTH - WINDOW_WIDTH / 5,
          color: isCurrentUser ? '#FFF' : '#000'
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