import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  FlatList,
} from 'react-native'
import PropTypes from 'prop-types'
import Attachment from './attachment'

class AttachmentsList extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  }

  renderItem = ({item}) => <Attachment {...item} size = {50}/>

  render() {
    return <View style = {styles.container}>
      <FlatList
        horizontal = {true}
        data = {this.props.attachments}
        renderItem = {this.renderItem}
      />
    </View>

  }

}

const styles = StyleSheet.create({
  container: {
    display: 'flex'
  }
})

export default AttachmentsList