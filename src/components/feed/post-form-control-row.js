import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import PostButton from './post-button'
import {inject} from 'mobx-react'
import {NAVIGATION_STORE} from '../../constants'

@inject(NAVIGATION_STORE)
class PostFormControlRow extends Component {
  static propTypes = {
    attachImageHandler: PropTypes.func,
    attachPhotoHandler: PropTypes.func
  }

  render() {
    return <View style = {styles.container}>
      <PostButton icon = 'ios-photos' onPress = {this.props.attachImageHandler}/>
      <PostButton icon = 'ios-pin' onPress = {() => this.props.navigation.navigate('locationForm')}/>
      <PostButton icon = 'ios-person' onPress = {() => ({})}/>
      <PostButton icon = 'ios-camera' onPress = {this.props.attachPhotoHandler}/>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 15
  },
})

export default PostFormControlRow