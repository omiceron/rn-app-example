import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground
} from 'react-native'
import PropTypes from 'prop-types'

class Attachment extends Component {
  static propTypes = {
    uri: PropTypes.string,
    loading: PropTypes.any,
    size: PropTypes.number
  }

  render() {
    const {uri, loading, size = 50} = this.props
    const thumbnailSize = {width: size, height: size}

    return <View style = {[styles.container]}>
      <View style = {[styles.thumbnail, thumbnailSize]}>
        <ImageBackground
          source = {{uri}}
          style = {styles.content}
          imageStyle = {[styles.thumbnail, thumbnailSize]}
        >
          {loading ? <ActivityIndicator/> : null}
        </ImageBackground>
      </View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 10
  },
  thumbnail: {
    borderRadius: 12
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})

export default Attachment