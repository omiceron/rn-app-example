import React, {Component, PureComponent} from 'react'
import {Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing, Image} from 'react-native'
import PropTypes from 'prop-types'
import Separator from '../common/separator'
import {inject, observer} from 'mobx-react'
import {computed} from 'mobx'
import {FEED_STORE, HIT_SLOP} from '../../constants/index'
import {
  NAVIGATION_STORE, WHITE_BACKGROUND_COLOR, INACTIVE_TEXT_COLOR,
  BLACK_TEXT_COLOR
} from '../../constants'
import AttachedLocation from './attached-location'
import PostControlRow from './post-control-row'
import Attachments from '../common/attachments'

@inject(NAVIGATION_STORE)
@inject(FEED_STORE)
@observer
class PostCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    coords: PropTypes.object
  }

  @computed
  get likesNumber() {
    return this.props.feed.getPostLikesNumber(this.props.uid)
  }

  @computed
  get isLiked() {
    return this.props.feed.isPostLiked(this.props.uid)
  }

  render() {
    console.log('render')
    const {title, text, location, uid, navigation, feed, coords, attachments} = this.props

    return <View style = {[styles.container]}>
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

      {attachments && <Attachments attachments = {attachments}/>}

      {location &&
      <AttachedLocation
        location = {location}
        style = {{marginBottom: 8}}
        onPress = {() => navigation.navigate('mapScreen', {coords})}
      />}

      <Separator/>

      <PostControlRow
        isLiked = {this.isLiked}
        likesNumber = {this.likesNumber}
        onLikePress = {() => feed.setLike(uid)}
        onCounterPress = {() => navigation.push('likesList', {postId: uid})}
      />

    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE_BACKGROUND_COLOR,
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
    margin: 8
  },
  text: {
    color: INACTIVE_TEXT_COLOR,
    fontSize: 16,
    fontWeight: '100'
  },
  title: {
    color: BLACK_TEXT_COLOR,
    fontSize: 16,
    fontWeight: '600'
  },
  row: {
    marginVertical: 8
  }
})

export default PostCard