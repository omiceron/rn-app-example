import React, {Component, PureComponent} from 'react'
import {Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing} from 'react-native'
import PropTypes from 'prop-types'
import Separator from '../common/separator'
import Icon from 'react-native-vector-icons/Ionicons'
import {inject} from 'mobx-react'
import {FEED_STORE, HIT_SLOP} from '../../constants/index'
import AttachedMap from './attached-map'
import {NAVIGATION_STORE} from '../../constants'
import {isPropsDiffer} from '../../stores/utils'

@inject(NAVIGATION_STORE)
@inject(FEED_STORE)
class PostCard extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    likesNumber: PropTypes.number.isRequired,
    isLiked: PropTypes.bool.isRequired,
    uid: PropTypes.string.isRequired,
    coords: PropTypes.object
  }

  animation = new Animated.Value(0)

  interpolation = this.animation.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [1, 0.9, 1.1, 1]
  })

  shouldComponentUpdate(nextProps) {
    const {likesNumber: newLikesNumber, isLiked: newIsLiked} = nextProps
    const {likesNumber, isLiked} = this.props

    return likesNumber !== newLikesNumber || isLiked !== newIsLiked
  }

  renderLike = () => {
    const {isLiked} = this.props

    const AnimatedIcon = Animated.createAnimatedComponent(Icon)

    return <TouchableWithoutFeedback hitSlop = {HIT_SLOP} onPress = {this.likeHandler}>
      <View>
        <AnimatedIcon color = {isLiked ? '#FF0000' : 'rgba(127,127,127,1)'}
                      size = {30}
                      name = {`ios-heart${isLiked ? '' : '-outline'}`}
                      style = {[styles.icon, {transform: [{scale: this.interpolation}]}]}/>
      </View>
    </TouchableWithoutFeedback>
  }

  renderLikesNumber = () => {
    const {likesNumber, uid} = this.props
    return <View style = {styles.likesNumberView}>
      {likesNumber &&
      <TouchableOpacity onPress = {() => this.props.navigation.navigate('likesList', {postId: uid})}>
        <Text style = {styles.text}>
          {likesNumber}
        </Text>
      </TouchableOpacity>}
    </View>

  }

  renderComments = () => {
    return <Icon color = 'rgba(127,127,127,1)' size = {30} name = 'ios-text-outline' style = {styles.icon}/>

  }

  render() {
    const {title, text, coords} = this.props
    console.log('render card', title)

    return <View style = {styles.container}>
      <TouchableOpacity>
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

      {coords && <AttachedMap onPress = {() => alert('map pressed')} coords = {coords}/>}

      <Separator/>

      <View style = {styles.buttonsView}>
        {this.renderLike()}
        {this.renderLikesNumber()}
        {this.renderComments()}
      </View>

    </View>
  }

  likeHandler = () => {
    this.props.feed.setLike(this.props.uid)

    Animated.sequence([
      Animated.timing(this.animation, {
        toValue: 1,
        duration: 200
      }),
      Animated.timing(this.animation, {
        toValue: 0,
        duration: 0
      })
    ]).start()

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
    fontSize: 24,
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
    alignItems: 'center',
    marginVertical: 8
  },
  icon: {
    marginRight: 8
  },

  likeView: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  likesNumberView: {
    marginRight: 16,
    width: 32
  }
})

export default PostCard