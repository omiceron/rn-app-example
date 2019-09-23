import React, {Component} from 'react'
import { StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { INACTIVE_BACKGROUND_COLOR } from '../../../constants'
import BasicSeparator from '../separator/basic-separator'
import BasicList from '../grid/basic-list'

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
      <BasicList {...rest} separator = {this.renderSeparator} style = {[styles.container, style]}>
        {children}
      </BasicList>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: INACTIVE_BACKGROUND_COLOR
  }
})

export default Table
