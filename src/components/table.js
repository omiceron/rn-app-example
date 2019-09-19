import React, {Component} from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import PropTypes from 'prop-types'
import { INACTIVE_TEXT_COLOR, WHITE_BACKGROUND_COLOR } from '../constants'
import BasicSeparator from './common/separator/basic-separator'
import BasicList from './common/basic-list'

class Table extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    children: PropTypes.node.isRequired,
    scrollable: PropTypes.bool
  }

  renderSeparator = () => <BasicSeparator size = {40}/>

  render() {
    const {children, style, ...rest} = this.props
    return (
      <BasicList {...rest} separator = {this.renderSeparator} style = {style}>
        {children}
      </BasicList>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE_BACKGROUND_COLOR,
  }
})

export default Table
