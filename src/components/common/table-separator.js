import React, {PureComponent} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import PropTypes from 'prop-types'

class RowSeparator extends PureComponent {
  static propTypes = {
    hint: PropTypes.string
  }

  render() {
    const {hint} = this.props
    return <View style = {styles.container}>
      {hint && <Text style = {styles.hint}>{hint}</Text>}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 40,
    alignItems: 'center'
  },
  hint: {
    fontWeight: '100',
    color: 'grey',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8,
  }
})

export default RowSeparator

