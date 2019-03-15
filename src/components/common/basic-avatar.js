import React, {Component, PureComponent} from 'react'
import {View, ImageBackground, StyleSheet, Image, ActivityIndicator} from 'react-native'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'
import {observable} from 'mobx'
import Icon from 'react-native-vector-icons/Ionicons'
import {INACTIVE_BACKGROUND_COLOR, WHITE_TEXT_COLOR} from '../../constants'

@observer
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
        source = {uri ? {uri} : require('../../../assets/images/no-photo.png')}
        // source = {{uri: uri || `https://loremflickr.com/200/200/cat?random=${Math.random()}`}}
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