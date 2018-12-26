import React, {Component} from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types'

class NavigationButton extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    title: (props, propName, componentName) => {
      if (props.title === undefined && props.icon === undefined) {
        return new Error(`One of props 'title' or 'icon' was not specified in '${componentName}'.`)
      }

      if (props.title && typeof props.title !== 'string') {
        return new Error(`Title must be a string in '${componentName}'.`)
      }
    },
    icon: PropTypes.string
  }

  render() {
    const {onPress, title, icon} = this.props
    const renderIcon = () => <Icon color = 'white' size = {40} name = {icon}/>
    const renderTitle = () => <Text style = {styles.text}>{title}</Text>

    return <View style = {styles.container}>
      <TouchableOpacity onPress = {onPress}>
        {(icon ? renderIcon : renderTitle)()}
      </TouchableOpacity>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    flexDirection: 'row'
  },
  text: {
    color: '#FFF',
    fontSize: 16
  }
})

export default NavigationButton