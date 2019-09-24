import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground
} from 'react-native'
import PropTypes from 'prop-types'

class AttachedImage extends Component {
  static propTypes = {
    uri: PropTypes.string,
    loading: PropTypes.any,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }

  render() {
    const {uri, loading, width, height} = this.props
    const containerStyle = StyleSheet.compose(styles.container, {width, height})

    return (
      <View style = {containerStyle}>
        <ImageBackground
          source = {{uri}}
          style = {styles.content}
          imageStyle = {containerStyle}
        >
          {loading ? <ActivityIndicator/> : null}
        </ImageBackground>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})

export default AttachedImage
