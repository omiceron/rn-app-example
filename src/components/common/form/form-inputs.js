import React, {Component} from 'react'
import { StyleSheet, View, ScrollView, Text, TextInput } from 'react-native'
import PropTypes from 'prop-types'
import {
  BLACK_TEXT_COLOR,
  INACTIVE_BACKGROUND_COLOR,
  INACTIVE_TEXT_COLOR,
  WHITE_BACKGROUND_COLOR
} from '../../../constants'
import BasicList from '../grid/basic-list'
import LinedSeparator from '../separator/lined-separator'
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper'
import Table from '../table/table'
import Form from './form'
import TableRow from '../table/table-row'

class FormInputs extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    // children: PropTypes.node.isRequired,
    scrollable: PropTypes.bool
  }

  inputs = []

  addRef = (ref) => this.inputs = [...this.inputs, ref]

  focus = (index) => () => this.inputs[index].focus()

  render() {
    const {data, style, ...rest} = this.props

    const inputs = data.map((input, index) => {

      const {value, placeholder, onChangeText, stretch, multiline} = input

      const autoFocus = index === 0
      const onSubmitEditing = index !== data.length - 1 ? this.focus(index + 1) : undefined
      const returnKeyType = index !== data.length - 1 ? 'next' : undefined

      return (
        <React.Fragment key={index}>
          <TableRow style={stretch && styles.stretchedRow}>
            <TextInput
              autoFocus={autoFocus}
              style={styles.text}
              placeholder={placeholder}
              returnKeyType={returnKeyType}
              value={value}
              multiline={multiline}
              onChangeText={onChangeText}
              onSubmitEditing={onSubmitEditing}
              ref={this.addRef}
            />
          </TableRow>
          {index !== data.length - 1 && <LinedSeparator/>}
        </React.Fragment>
      )
    })


    return (
      <React.Fragment>
          {inputs}
      </React.Fragment>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '100',
    color: BLACK_TEXT_COLOR
  },
  stretchedRow: {
    flex: 1,
    alignItems: 'flex-start'
  },
})

export default FormInputs
