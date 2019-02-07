import React, {Component} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import PropTypes from 'prop-types'

class EmptyList extends Component {
  static propTypes = {}

  render() {
    return <View style = {styles.container}>
      <Text style = {styles.text}>
        You have no messages yet...
      </Text>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: 'rgba(127,127,127,1)',
    fontSize: 20,
    fontWeight: '200'
  }
})

export default EmptyList