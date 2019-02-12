import React, {Component} from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types'

class AttachedLocation extends Component {
  static propTypes = {
    location: PropTypes.string.isRequired,
    onPress: PropTypes.func
  }

  render() {
    return <TouchableOpacity onPress = {this.props.onPress}>
      <View style = {styles.container}>

        <View style = {styles.iconContainer}>
          <Icon size = {20} color = 'rgba(127,127,127,1)' name = 'ios-pin'/>
        </View>

        <View style = {styles.textContainer}>
          <Text style = {styles.text} numberOfLines = {1}>
            {this.props.location}
          </Text>
        </View>

      </View>
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  iconContainer: {
    marginRight: 4,
    // marginLeft: 8,
    marginVertical: 4,
    height: 24,
    width: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textContainer: {
    flex: 1
    // marginVertical: 8
  },
  text: {
    color: 'rgba(127,127,127,1)',
    fontSize: 16,
    fontWeight: '100'
  }
})

export default AttachedLocation