import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'

class BasicCard extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    children: PropTypes.node,
  }

  render() {
    const {children, style, ...rest} = this.props
    return <View {...rest} style = {[styles.container, style]}>
      {children}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',

    padding: 8,
  }
})

export default BasicCard
