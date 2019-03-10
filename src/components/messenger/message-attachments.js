import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground
} from 'react-native'
import PropTypes from 'prop-types'

class MessageAttachments extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  }

  renderItem = ({item}) => <View key = {item.key} style = {styles.attachmentContainer}>
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
      {this.props.attachments.map(item => this.renderItem({item}))}
    </View>
  }

}

const styles = StyleSheet.create({
  container: {},
  attachmentContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thumbnail: {
    width: 90,
    height: 90,
    borderRadius: 12
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})

export default MessageAttachments