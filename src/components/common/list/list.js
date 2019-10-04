import React, { Component, Fragment } from 'react'
import { StyleSheet, SectionList, Text, View, FlatList } from 'react-native'
import PropTypes from 'prop-types'
import { INACTIVE_BACKGROUND_COLOR, INACTIVE_TEXT_COLOR } from '../../../constants'
import BasicSeparator from '../separator/basic-separator'
import LinedSeparator from '../separator/lined-separator'
import TableRow from '../table/table-row'

class List extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    scrollable: PropTypes.bool,
    sections: PropTypes.array.isRequired
  }

  // inputs = {}

  // addInputRef = (ref) => this.inputs[ref.props.name] = ref

  // focusOnInput = (name) => () => this.inputs[name].focus()

  inputs = []

  getTotalLength = () => this.inputs.length

  addInputRef = (ref) => this.inputs = [...this.inputs, ref]

  focusOnInput = (index) => () => this.inputs[index].focus()

  renderHint = (hint) => (
    <View style = {{ padding: 8, backgroundColor: INACTIVE_BACKGROUND_COLOR }}>
      <Text style = {[styles.text, styles.hint]}>
        {hint}
      </Text>
    </View>
  )

  renderSectionSeparatorComponent = ({leadingItem, trailingItem, section: {hint}}) => (
    <Fragment>
      {leadingItem ? <LinedSeparator noMargins/> : null}
      {!trailingItem && hint ? this.renderHint(hint) : null}
      {trailingItem ? <LinedSeparator noMargins/> : null}
      {!trailingItem ? <BasicSeparator style={{backgroundColor: INACTIVE_BACKGROUND_COLOR}} size={40}/> : null}
    </Fragment>
  )

  renderItem = ({ item: { customComponent: Component}, item }) => (
    Component ? <Component addInputRef={this.addInputRef} focusOnInput={this.focusOnInput} getTotalLength = {this.getTotalLength}/> : <TableRow {...item}/>
  )

  renderSectionHeader = ({ section: { header } }) => (
    header ? (
      <View style={{ padding: 8, backgroundColor: INACTIVE_BACKGROUND_COLOR }}>
        <Text style={[styles.text, styles.header]}>
          {header}
        </Text>
      </View>
    ) : null
  )

  render() {
    const {children, style, sections, ...rest} = this.props

    return (
      <SectionList
        renderSectionHeader={this.renderSectionHeader}
        style={styles.container}
        contentContainerStyle={{backgroundColor: 'white'}}
        renderItem={this.renderItem}
        SectionSeparatorComponent={this.renderSectionSeparatorComponent}
        ItemSeparatorComponent={LinedSeparator}
        keyExtractor={item => item}
        stickySectionHeadersEnabled={false}
        initialNumToRender = {Number.MAX_SAFE_INTEGER}
        sections={sections}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: INACTIVE_BACKGROUND_COLOR
  },
  text: {
    fontWeight: '100',
    color: INACTIVE_TEXT_COLOR,
  },
  hint: {
    alignSelf: 'center',
  },
  header: {
    alignSelf: 'flex-start',
  }
})

export default List
