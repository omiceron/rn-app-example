import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ImageBackground
} from 'react-native'
import PropTypes from 'prop-types'

// @observer
class AttachmentsList extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  }

  renderItem = ({item}) => <View style = {styles.attachmentContainer}>
    <View style = {styles.thumbnail}>
      <ImageBackground
        source = {{uri: item.uri}}
        style = {styles.content}
        imageStyle = {styles.thumbnail}
      >
        {item.loading ? <ActivityIndicator/> : null}
      </ImageBackground>
    </View>
  </View>

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
  },
  attachmentContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 12
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})

export default AttachmentsList