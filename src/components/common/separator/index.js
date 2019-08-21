import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'

class Separator extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    leftIndent: PropTypes.number,
    topIndent: PropTypes.number,
    vertical: PropTypes.bool,
    size: PropTypes.number,
    empty: PropTypes.bool
  }

  render() {
    const {
      leftIndent: marginLeft,
      topIndent: marginTop,
      style,
      vertical,
      size,
      empty
    } = this.props

    const horizontalStyle = {
      height: StyleSheet.hairlineWidth
    }

    const verticalStyle = {
      width: StyleSheet.hairlineWidth
    }

    return <View
      style = {[
        styles.container,
        !empty && (vertical ? verticalStyle : horizontalStyle),
        style,
        {
          marginLeft,
          marginTop
        },
        size && {
          margin: size,
          marginHorizontal: size
        }
      ]}/>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(192,192,192,0.5)',
    // TODO: remove this ↓↓↓
    marginHorizontal: 8
  }
})

export default Separator

