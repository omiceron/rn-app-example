import React, {Component} from 'react'
import { StyleSheet, FlatList, TextInput } from 'react-native'
import PropTypes from 'prop-types'
import { BLACK_TEXT_COLOR } from '../../../constants'
import LinedSeparator from '../separator/lined-separator'
import TableRow from '../table/table-row'

class FormInputs extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    scrollable: PropTypes.bool,
    data: PropTypes.array.isRequired
  }

  inputs = []

  addRef = (ref) => this.inputs = [...this.inputs, ref]

  focus = (index) => () => this.inputs[index].focus()

  renderItem = ({ item, index }) => {
    const { data, addInputRef, focusOnInput, getTotalLength } = this.props

    const { stretch, multiline, ...rest } = item

    const isFirstItem = index === 0
    const isLastItem = index === getTotalLength() - 1
    const onSubmitEditing = !isLastItem ? (focusOnInput ? focusOnInput(index + 1) : this.focus(index + 1)) : undefined
    const returnKeyType = multiline ? 'default' : !isLastItem ? 'next' : 'done'

    return (
      <TableRow style={stretch && styles.stretchedRow}>
        <TextInput
          {...rest}
          autoFocus={isFirstItem}
          style={styles.text}
          returnKeyType={returnKeyType}
          multiline={multiline}
          onSubmitEditing={onSubmitEditing}
          blurOnSubmit={false}
          ref={addInputRef || this.addRef}
        />
      </TableRow>
    )
  }

  render() {
    const { data, scrollable } = this.props

    return (
      <FlatList
        renderItem={this.renderItem}
        ItemSeparatorComponent={LinedSeparator}
        data={data}
        scrollEnabled={scrollable}
        keyExtractor={item => item.name}
      />
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
