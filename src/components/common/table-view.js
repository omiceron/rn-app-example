import React, {Component} from 'react'
import {StyleSheet, View, ScrollView, Text} from 'react-native'
import PropTypes from 'prop-types'
import {WHITE_BACKGROUND_COLOR} from '../../constants'

class TableView extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    children: PropTypes.node.isRequired,
    scrollable: PropTypes.bool
  }

  render() {
    const {style, children, scrollable, ...rest} = this.props
    const childrenArray = React.Children.toArray(children)
    const ViewComponent = scrollable ? ScrollView : View

    return <ViewComponent {...rest} style = {[styles.container, style]}>
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
    // flex: 1,
    backgroundColor: WHITE_BACKGROUND_COLOR,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(192,192,192,0.5)'

  },
  headerText: {
    fontWeight: '100',
    color: 'grey',
    marginLeft: 8,
    marginRight: 8,
    marginTop: 8
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 30
  }
})

export default TableView