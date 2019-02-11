import React, {Component} from 'react'
import {View, TextInput, TouchableWithoutFeedback, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AuthRow from './auth-row'

class AuthInputRow extends Component {
  static propTypes = {
    isNonEmpty: PropTypes.bool,
    secureTextEntry: PropTypes.bool,
    setRef: PropTypes.func
  }

  componentDidMount() {
    this.props.setRef && this.props.setRef(this)
  }

  state = {
    isSecured: this.props.secureTextEntry,
    isFocused: false
  }

  focus() {
    this.textInput.focus()
  }

  toggleVisibility = () => {
    this.setState({
      isSecured: !this.state.isSecured
    })
  }

  setFocused = () => {
    this.setState({isFocused: true})
  }

  setBlurred = () => {
    this.setState({isFocused: false})
  }

  renderVisibilitySwitch() {
    return <TouchableWithoutFeedback
      onPress = {this.toggleVisibility}
      hitSlop = {{top: 20, left: 20, bottom: 20, right: 20}}>
      <View style = {styles.icon}>
        <Icon size = {19}
              color = 'rgba(0, 0, 0, 0.2)'
              name = {`visibility${this.state.isSecured ? '' : '-off'}`}/>
      </View>
    </TouchableWithoutFeedback>
  }

  render() {
    const {value, visibilitySwitch, onFocus, onBlur, ...rest} = this.props
    return <AuthRow style = {styles.container}>
      <TextInput
        {...rest}
        value = {value}
        onFocus = {(...args) => {
          this.setFocused()
          if (onFocus) return onFocus(...args)
        }}
        onBlur = {(...args) => {
          this.setBlurred()
          if (onBlur) return onBlur(...args)
        }}

        ref = {ref => this.textInput = ref}
        secureTextEntry = {this.state.isSecured}

        style = {styles.text}
        autoCapitalize = 'none'
        spellCheck = {false}
        autoCorrect = {false}
      />
      {this.state.isFocused && visibilitySwitch && !!value && this.renderVisibilitySwitch()}
    </AuthRow>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255, 0.8)',
  },
  text: {
    flex: 1,
    alignContent: 'center',
    height: 50,
    paddingLeft: 25,
    fontSize: 18,
    fontFamily: 'HelveticaNeue-Thin',
  },
  icon: {
    margin: 6,
    justifyContent: 'center',
    alignItems: 'center',

  }
})

export default AuthInputRow