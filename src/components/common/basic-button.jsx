import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Ionicons'
import { INACTIVE_BACKGROUND_COLOR, USER_MESSAGE_COLOR, WHITE_TEXT_COLOR } from '../../constants'

class BasicButton extends Component {
  static propTypes = {
    isActive: PropTypes.any,
    icon: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
    color: PropTypes.string,
    activeBackgroundColor: PropTypes.string,
    inactiveBackgroundColor: PropTypes.string,
  }

  render() {
    const { isActive = true, icon, size, onPress, color, activeBackgroundColor, inactiveBackgroundColor } = this.props

    const InteractiveComponent = isActive ? TouchableOpacity : View
    const backgroundColor = isActive ? activeBackgroundColor : inactiveBackgroundColor

    return (
      <View style={styles.container}>
        <InteractiveComponent onPress={onPress}>
          <View style={[styles.button, { backgroundColor }]}>
            <Icon style={{ paddingTop: size / 10 }} name={icon} size={size} color={color} />
          </View>
        </InteractiveComponent>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    padding: 8,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 36,
    width: 36,
    borderRadius: 18,
  },
})

export default BasicButton
