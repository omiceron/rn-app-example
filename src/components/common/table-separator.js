import React, {PureComponent} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import PropTypes from 'prop-types'
import {INACTIVE_TEXT_COLOR} from '../../constants'

class RowSeparator extends PureComponent {
  static propTypes = {
    hint: PropTypes.string,
    header: PropTypes.string
  }

  render() {
    const {hint, header} = this.props
    return <View style = {styles.container}>
      {hint && <Text style = {[styles.text, styles.hint]}>{hint}</Text>}
      <View style = {styles.separator}/>
      {header && <Text style = {[styles.text, styles.header]}>{header}</Text>}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
    // display: 'flex',
    // justifyContent: 'flex-start',
    // alignItems: 'center'
  },
  separator: {
    display: 'flex',
    height: 40,
  },
  text: {
    fontWeight: '100',
    color: INACTIVE_TEXT_COLOR,
    margin: 8
  },
  hint: {
    alignSelf: 'center',
    marginBottom: 0
  },
  header: {
    alignSelf: 'flex-start',
    marginTop: 0
  }
})

export default RowSeparator

