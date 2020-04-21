import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, Text, SafeAreaView } from 'react-native'
import PropTypes from 'prop-types'
import { INACTIVE_BACKGROUND_COLOR, INACTIVE_TEXT_COLOR, WHITE_BACKGROUND_COLOR } from '../../../constants'
import BasicList from '../grid/basic-list'
import LinedSeparator from '../separator/lined-separator'
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper'

class Form extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    children: PropTypes.node.isRequired,
    scrollable: PropTypes.bool,
  }

  render() {
    const { children, style, keyboardHeight, ...rest } = this.props

    return (
      <SafeAreaView style={[styles.container, style]}>
        <BasicList {...rest} style={[styles.container]}>
          {children}
        </BasicList>
        <View style={{ height: keyboardHeight - (isIphoneX() ? getBottomSpace() : 0) }} />
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default Form
