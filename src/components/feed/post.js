import React, {Component} from 'react'
import {View, StyleSheet, Text} from 'react-native'
import PropTypes from 'prop-types'
import AttachedMap from './attached-map'

class Post extends Component {
  static propTypes = {
    post: PropTypes.shape({
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      coords: PropTypes.object
    }).isRequired
  }

  render() {
    const {title, text, coords} = this.props.post

    return <View>
      <Text>
        {title}
      </Text>
      <Text>
        {text}
      </Text>
      {coords && <AttachedMap onPress = {() => alert('map pressed')} coords = {coords}/>}
    </View>
  }
}

const styles = StyleSheet.create({
  container: {}
})

export default Post