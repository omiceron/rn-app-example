// @flow

// import React, {Component} from 'react'
import * as React from 'react'
import { Animated, Keyboard } from 'react-native'
import { observable, action } from 'mobx'

import { KEYBOARD_EASING, KEYBOARD } from '../../constants'
import { observer, inject } from 'mobx-react'

export default (...props: string[]) => (
  AnimatedComponent: React.ComponentType<any>
  // useNativeDriver: props.useNativeDriver === undefined || props.useNativeDriver
  // const {height, screenY: y} = event.endCoordinates
) =>
  @observer
  class WithAnimation extends React.Component<*> {
    constructor(...args) {
      super(...args)

      if (!props) console.error('layoutNames type error')

      props.forEach((name) => (this.layouts[name] = { height: 0, y: 0 }))
    }

    componentDidMount() {
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
        useNativeDriver: true,
      }).start()
    }

    @action onFocus = (event) => {
      const { height, screenY: y } = event.endCoordinates
      this.layouts[KEYBOARD] = { height, y }
      this.startTimingAnimation(event, 1)
    }

    @action onBlur = (event) => {
      this.layouts[KEYBOARD] = { height: 0, y: 0 }

      this.startTimingAnimation(event, 0)
    }

    onExit = () => {
      this.startTimingAnimation({ duration: 0 }, 0)
    }

    render() {
      return (
        <AnimatedComponent
          {...this.props}
          setLayout={this.setLayout}
          layouts={this.layouts}
          animation={this.animation}
          getAnimation={this.getAnimation}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
      )
    }
  }
