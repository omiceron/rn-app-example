import React, {Component} from 'react'
import {View, Text, TextInput, TouchableOpacity, Platform, Switch, StyleSheet} from 'react-native'
import SegmentedCard from './segmented-card'
import Separator from './separator'
import PropTypes from 'prop-types'

class TableRow extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    // titleStyle: Text.propTypes.style,
    // captionStyle: View.propTypes.style,
    children: PropTypes.node,
    title: PropTypes.string,
    caption: PropTypes.string,
    leadingItem: PropTypes.bool,
    trailingItem: PropTypes.bool,
    value: PropTypes.bool,
    onValueChange: PropTypes.func,
    disableSeparator: PropTypes.bool,
    RightComponent: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.func,
    ]),
  }

  render() {
    const {
      titleStyle,
      captionStyle,
      title,
      onValueChange,
      leadingItem,
      trailingItem,
      value,
      caption,
      style,
      disableSeparator,
      RightComponent,
      children,
      ...rest
    } = this.props

    const SwitchComponent = () => <Switch value = {value} onValueChange = {onValueChange}/>

    return <React.Fragment>
      <SegmentedCard
        RightComponent = {RightComponent || onValueChange && SwitchComponent}
        mainContainerStyle = {styles.textView}
        style = {[styles.container, style]}
        {...rest}>
        {title ? <Text style = {[styles.title, titleStyle]}>{title}</Text> : children}
        {caption && <Text style = {[styles.caption, captionStyle]}>{caption}</Text>}
      </SegmentedCard>
      {!trailingItem && !disableSeparator && <Separator/>}
    </React.Fragment>
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 48,
    paddingHorizontal: 15,
    paddingVertical: 8
  },
  title: {
    fontSize: 16,
    fontWeight: '100'
  },
  caption: {
    marginTop: 4,
    fontWeight: '100',
    color: 'grey'
  },
  textView: {
    flex: 1,
    justifyContent: 'space-around'
  }
})

export default TableRow