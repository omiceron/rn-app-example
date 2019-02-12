import React, {Component, PureComponent} from 'react'
import {View, ImageBackground, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'

class BasicAvatar extends Component {
  static propTypes = {
    // style: View.propTypes.style,
    uri: PropTypes.string,
    size: PropTypes.number
  }

  render() {
    const {style, uri, size} = this.props

    const container = {
      height: size,
      width: size,
      borderRadius: size / 2
    }

    return <View style = {[container, style]}>
      <ImageBackground
        source = {{uri: uri || `https://loremflickr.com/200/200/cat?random=${Math.random()}`}}
        style = {styles.content}
        imageStyle = {[container]}
      >
        {this.props.children}
      </ImageBackground>
    </View>
  }
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  }
})

export default BasicAvatar