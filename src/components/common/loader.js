import React, {Component} from 'react'
import {View, StyleSheet, ActivityIndicator} from 'react-native'

class Loader extends Component {
  static propTypes = {}

  render() {
    return <View style = {styles.container}>
      <ActivityIndicator size = 'small'/>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Loader

