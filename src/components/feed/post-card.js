import React, {Component, PureComponent} from 'react'
import {Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing} from 'react-native'
import PropTypes from 'prop-types'
import Separator from '../common/separator'
import Icon from 'react-native-vector-icons/Ionicons'
import {inject, observer} from 'mobx-react'
import {FEED_STORE, HIT_SLOP} from '../../constants/index'
import AttachedMap from './attached-map'
import {NAVIGATION_STORE} from '../../constants'
import {isPropsDiffer} from '../../stores/utils'
import Like from './like'
import LikesCounter from './likes-counter'

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

  shouldComponentUpdate(nextProps) {
    const {likesNumber: newLikesNumber, isLiked: newIsLiked} = nextProps
    const {likesNumber, isLiked} = this.props

    return likesNumber !== newLikesNumber || isLiked !== newIsLiked
  }

  renderComments = () => {
    return <Icon color = 'rgba(127,127,127,1)' size = {30} name = 'ios-text-outline' style = {styles.icon}/>
  }

  render() {
    const {title, text, coords, uid, isLiked, likesNumber} = this.props
    console.log('render card', title, isLiked)

    return <View style = {styles.container}>
      <TouchableOpacity onPress = {() => this.props.navigation.navigate('postScreen', {postId: uid})}>
        <View style = {styles.titleView}>
          <Text numberOfLines = {1} style = {styles.title}>
            {title}
          </Text>
        </View>
        <Separator/>
        <View style = {styles.textView}>
          <Text numberOfLines = {10} style = {styles.text}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>

      <Separator/>

      <View style = {styles.buttonsView}>
        <Like
          style = {{marginRight: 4, marginVertical: 4}}
          onPress = {() => this.props.feed.setLike(uid)}
          activated = {isLiked}
        />
        <LikesCounter
          style = {{marginRight: 4, marginVertical: 4}}
          likesNumber = {likesNumber}
          onPress = {() => this.props.navigation.navigate('likesList', {postId: uid})}/>
        {this.renderComments()}
      </View>

    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    // marginHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(192,192,192,0.5)'
  },
  text: {
    color: 'rgba(127,127,127,1)',
    fontSize: 16,
    fontWeight: '100'
  },

  title: {
    fontSize: 16,
    fontWeight: '600'
  },

  textView: {
    // height: 100,
    marginVertical: 8
  },
  titleView: {
    marginVertical: 8
  },
  buttonsView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
    // marginVertical: 8
  },

  likesNumberView: {
    marginRight: 16,
    width: 32
  }
})

export default PostCard