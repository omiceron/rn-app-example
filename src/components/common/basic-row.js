import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import BasicColumn from './basic-column'

class BasicRow extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
    // separator: PropTypes.function,
  }

  render() {
    const {style, children, ...rest} = this.props

    return (
      <BasicColumn {...rest} style = {[styles.container, style]}>
        {children}
      </BasicColumn>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  }
})

export default BasicRow