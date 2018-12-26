import React, {Component} from 'react'
import {
  Animated, Keyboard
} from 'react-native'
import {observable, action} from 'mobx'

import {
  KEYBOARD_EASING,
  KEYBOARD,
} from "../../constants/index"

export default (AnimatedComponent, props) => class WithAnimation extends Component {

  constructor(...args) {
    super(...args)

    if (!props || !props.layoutNames || typeof props.layoutNames !== 'object' || !props.layoutNames.length) {
      console.error('layoutNames issue')
    }

    props.layoutNames.forEach(name => this.layouts[name] = {height: 0, y: 0})

  }

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.onFocus)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.onBlur)
  }

  componentWillUnmount() {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  @observable layouts = {}
  animation = new Animated.Value(0)

  setLayout = (name) => {
    return action((event) => {
      this.layouts[name] = event.nativeEvent.layout
    })
  }

  getAnimation = (type, getOutputRange) => {

    return this.animation.interpolate({
      inputRange: [0, 1],
      outputRange: getOutputRange(type),
    })
  }

  startTimingAnimation = (event, toValue) => {
    Animated.timing(this.animation, {
      toValue,
      duration: event.duration,
      easing: KEYBOARD_EASING,
      useNativeDriver: props.useNativeDriver === undefined || props.useNativeDriver
    }).start()
  }

  @action onFocus = (event) => {
    const {height, screenY: y} = event.endCoordinates
    this.layouts[KEYBOARD] = {height, y}
    this.startTimingAnimation(event, 1)
  }

  @action onBlur = (event) => {
    // const {height, screenY: y} = event.endCoordinates
    this.layouts[KEYBOARD] = {height: 0, y: 0}

    this.startTimingAnimation(event, 0)
  }

  onExit = () => {
    this.startTimingAnimation({duration: 0}, 0)
  }

  render() {
    return <AnimatedComponent
      {...this.props}
      setLayout = {this.setLayout}
      layouts = {this.layouts}
      animation = {this.animation}
      getAnimation = {this.getAnimation}
      onFocus = {this.onFocus}
      onBlur = {this.onBlur}
    />
  }
}