import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  FlatList
} from 'react-native'
import PropTypes from 'prop-types'
import Attachment from './attachment'
import {IMAGE_SEPARATOR_SIZE} from '../../../constants'

class AttachmentsRow extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  }

  renderItem = ({item}) => (
    <Attachment
      {...item}
      height = {50}
      width = {50}
    />
  )

  renderSeparator = () => <View style = {{width: IMAGE_SEPARATOR_SIZE}}/>

  render() {
    return (
      <FlatList
        style = {styles.container}
        horizontal = {true}
        ItemSeparatorComponent = {this.renderSeparator}
        data = {this.props.attachments}
        renderItem = {this.renderItem}
      />
    )
  }

}

const styles = StyleSheet.create({
  container: {
    // display: 'flex',
    // padding: IMAGE_SEPARATOR_SIZE
  }
})

export default AttachmentsRow
