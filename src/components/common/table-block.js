import React, {Component} from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import PropTypes from 'prop-types'
import { INACTIVE_TEXT_COLOR, TABLE_VIEW_BORDER_COLOR, WHITE_BACKGROUND_COLOR } from '../../constants'
import BasicSeparator from './separator/basic-separator'
import LinedSeparator from './separator/lined-separator'

class TableBlock extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    children: PropTypes.node.isRequired,
    scrollable: PropTypes.bool
  }

  renderHint = () => (
    <View style = {{ padding: 8 }}>
      <Text style = {[styles.text, styles.hint]}>
        {this.props.hint}
      </Text>
    </View>
  )

  renderHeader = () => (
    <View style = {{ padding: 8 }}>
      <Text style = {[styles.text, styles.header]}>
        {this.props.header}
      </Text>
    </View>
  )

  render() {
    const {style, children, scrollable, hint, header, disableSeparator, ...rest} = this.props
    const childrenArray = React.Children.toArray(children)
    const ViewComponent = scrollable ? ScrollView : View

    return (
      <ViewComponent {...rest} style = {style}>
        {header && this.renderHeader()}
        <View style = {[styles.container, style]}>
          {childrenArray.map((child, index) => (
            <React.Fragment>
              {React.cloneElement(child, {
              leadingItem: index === 0,
              trailingItem: index === childrenArray.length - 1
            })}
              {index !== childrenArray.length - 1 && !child.props.disableSeparator && <LinedSeparator/>}
            </React.Fragment>
          ))}
        </View>
        {hint && this.renderHint()}
        {!disableSeparator && <BasicSeparator size = {40}/>}
      </ViewComponent>
    )

    /*return <View>
          <View style = {styles.header}><Text style = {styles.headerText}>HEADER</Text></View>
          <ViewComponent {...rest} style = {[styles.container, style]}>
            {childrenArray.map((child, index) => {
              // const {leadingItem, trailingItem} = child.props
              return React.cloneElement(child, {
                leadingItem: index === 0,
                trailingItem: index === childrenArray.length - 1
                // leadingItem: leadingItem !== undefined ? leadingItem : index === 0,
                // trailingItem: trailingItem !== undefined ? trailingItem : index === childrenArray.length - 1
              })
            })}
          </ViewComponent>
        </View>
        */
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE_BACKGROUND_COLOR,
    // borderTopWidth: StyleSheet.hairlineWidth,
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: TABLE_VIEW_BORDER_COLOR,
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

export default TableBlock
