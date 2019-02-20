import React, {PureComponent} from 'react'
import {View, StyleSheet, Text, Keyboard, TouchableWithoutFeedback} from 'react-native'
import PropTypes from 'prop-types'
import {INACTIVE_BACKGROUND_COLOR, INACTIVE_TEXT_COLOR} from '../../constants'

class EmptyList extends PureComponent {
  static propTypes = {}

  render() {
    return <View style = {styles.container}>
      <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
        <Text style = {styles.text}>
          You have no messages yet...
        </Text>
      </TouchableWithoutFeedback>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: INACTIVE_BACKGROUND_COLOR
  },
  text: {
    color: INACTIVE_TEXT_COLOR,
    fontSize: 20,
    fontWeight: '200'
  }
})

export default EmptyList