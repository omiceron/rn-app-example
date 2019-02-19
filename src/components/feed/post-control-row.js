import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import Like from './like'
import LikesCounter from './likes-counter'
import PropTypes from 'prop-types'
// import Icon from 'react-native-vector-icons/Ionicons'

// import {inject, observer} from 'mobx-react'
// import {FEED_STORE, NAVIGATION_STORE} from '../../constants'
// @inject(FEED_STORE)
// @inject(NAVIGATION_STORE)
// @observer
class PostControlRow extends Component {
  static propTypes = {
    isLiked: PropTypes.bool.isRequired,
    likesNumber: PropTypes.number.isRequired,
    onLikePress: PropTypes.func,
    onCounterPress: PropTypes.func,
  }

  // renderComments = () => {
  //   return <Icon color = 'rgba(127,127,127,1)' size = {30} name = 'ios-text-outline' style = {styles.icon}/>
  // }

  // TODO: Decide how to use this - with injection and postId or with props
  render() {
    const {isLiked, likesNumber, onLikePress, onCounterPress} = this.props
    return <View style = {styles.container}>
      <Like
        style = {styles.button}
        onPress = {onLikePress}
        activated = {isLiked}
      />
      <LikesCounter
        style = {styles.button}
        likesNumber = {likesNumber}
        onPress = {onCounterPress}
      />
      {/*{this.renderComments()}*/}
    </View>

  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  button: {
    marginRight: 4,
    marginVertical: 4
  }
})

export default PostControlRow