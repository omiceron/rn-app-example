import React, {Component, PureComponent} from 'react'
import {Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing, Image} from 'react-native'
import PropTypes from 'prop-types'
import Separator from '../common/separator'
import {inject, observer} from 'mobx-react'
import {FEED_STORE, HIT_SLOP} from '../../constants/index'
import {
  NAVIGATION_STORE, POST_CARD_BACKGROUND_COLOR, POST_CARD_TEXT_COLOR,
  POST_CARD_TITLE_COLOR
} from '../../constants'
import AttachedLocation from './attached-location'
import PostControlRow from './post-control-row'

@inject(NAVIGATION_STORE)
@inject(FEED_STORE)
  // @observer
class PostCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    likesNumber: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    coords: PropTypes.object
  }

  // TODO: do something with this mess
  shouldComponentUpdate(nextProps) {
    const {likesNumber: newLikesNumber, isLiked: newIsLiked} = nextProps
    const {likesNumber, isLiked} = this.props

    return likesNumber !== newLikesNumber || isLiked !== newIsLiked
  }

  render() {
    const {title, text, location, uid, isLiked, likesNumber, navigation, feed, coords} = this.props
    console.log('render card', title, isLiked)

    return <View style = {styles.container}>
      <TouchableOpacity onPress = {() => navigation.navigate('postScreen', {postId: uid})}>

        <View style = {styles.row}>
          <Text numberOfLines = {1} style = {styles.title}>
            {title}
          </Text>
        </View>

        <Separator/>

        <View style = {styles.row}>
          <Text numberOfLines = {10} style = {styles.text}>
            {text}
          </Text>
        </View>

      </TouchableOpacity>

      {location &&
      <AttachedLocation location = {location} onPress = {() => navigation.navigate('mapScreen', {coords})}/>}

      <Separator/>

      <PostControlRow
        isLiked = {isLiked}
        likesNumber = {likesNumber}
        onLikePress = {() => feed.setLike(uid)}
        onCounterPress = {() => navigation.push('likesList', {postId: uid})}
      />

    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: POST_CARD_BACKGROUND_COLOR,
    paddingHorizontal: 8,
    borderColor: 'rgba(192,192,192,0.5)',
    // borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 6,
    shadowOffset: {
      width: 3,
      height: 3
    },
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginHorizontal: 8,
    marginTop: 8,
  },
  text: {
    color: POST_CARD_TEXT_COLOR,
    fontSize: 16,
    fontWeight: '100'
  },
  title: {
    color: POST_CARD_TITLE_COLOR,
    fontSize: 16,
    fontWeight: '600'
  },
  row: {
    marginVertical: 8
  }
})

export default PostCard