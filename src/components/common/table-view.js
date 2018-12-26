import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'

class TableView extends Component {
  static propTypes = {
    style: View.propTypes.style,
    children: PropTypes.node.isRequired
  }

  render() {
    const {style, children, ...rest} = this.props
    const childrenArray = React.Children.toArray(children)

    return <View {...rest} style = {[styles.container, style]}>
      {childrenArray.map((child, index) => {
        // const {leadingItem, trailingItem} = child.props
        return React.cloneElement(child, {
          leadingItem: index === 0,
          trailingItem: index === childrenArray.length - 1
          // leadingItem: leadingItem !== undefined ? leadingItem : index === 0,
          // trailingItem: trailingItem !== undefined ? trailingItem : index === childrenArray.length - 1
        })
      })}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#FFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(192,192,192,0.5)'

  }
})

export default TableView