import React, {PureComponent} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'

class Separator extends PureComponent {
  static propTypes = {
    style: View.propTypes.style,
    leftIndent: PropTypes.number,
    topIndent: PropTypes.number,
  }

  render() {
    const {leftIndent: marginLeft, topIndent: marginTop, style} = this.props
    return <View style = {[styles.container, style, {marginLeft, marginTop}]}/>
  }
}

const styles = StyleSheet.create({
  container: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(192,192,192,0.5)',
    marginHorizontal: 8,
  },
})

export default Separator

