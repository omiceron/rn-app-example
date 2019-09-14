import React, {PureComponent} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import PropTypes from 'prop-types'
import {INACTIVE_TEXT_COLOR} from '../../constants'
import BasicSeparator from './separator/basic-separator'

class RowSeparator extends PureComponent {
  static propTypes = {
    hint: PropTypes.string,
    header: PropTypes.string
  }

  render() {
    const {hint, header} = this.props
    return (
      <BasicSeparator style = {styles.container}>
        {hint && <Text style = {[styles.text, styles.hint]}>{hint}</Text>}
        <BasicSeparator size = {40}/>
        {header && <Text style = {[styles.text, styles.header]}>{header}</Text>}
      </BasicSeparator>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 8
  },
  text: {
    fontWeight: '100',
    color: INACTIVE_TEXT_COLOR,
  },
  hint: {
    alignSelf: 'center',
  },
  header: {
    alignSelf: 'flex-start',
  }
})

export default RowSeparator

