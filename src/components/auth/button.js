import React, {Component} from 'react'
import {Text, TouchableOpacity, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import AuthRow from './auth-row'

class AuthButton extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    title: PropTypes.string.isRequired
  }

  render() {
    const {title, onPress, disabled} = this.props
    return <TouchableOpacity disabled = {disabled} onPress = {onPress}>
      <AuthRow style = {disabled ? styles.disabled : styles.container}>
        <Text style = {disabled ? styles.disabledText : styles.text}>
          {title}
        </Text>
      </AuthRow>
    </TouchableOpacity>
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255, 0.1)',

  },
  disabled: {
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255, 0.1)',
    borderColor: 'rgba(255,255,255, 0.1)',
    // borderWidth: 0,
  },
  text: {
    color: 'rgba(255,255,255, 0.8)',
    fontSize: 18,
    fontFamily: 'HelveticaNeue-Thin'
  },
  disabledText: {
    color: 'rgba(255,255,255, 0.5)',
    fontSize: 18,
    fontFamily: 'HelveticaNeue-Thin'
  }
})

export default AuthButton