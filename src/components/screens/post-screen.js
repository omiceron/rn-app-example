import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {FEED_STORE, PEOPLE_STORE} from '../../constants'
import Post from '../feed/post'
import {observable, action, computed, autorun, reaction} from 'mobx'
import Loader from '../common/loader'

@inject(PEOPLE_STORE)
@inject(FEED_STORE)
@observer
class PostScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return ({
      title: 'Post',
      headerStyle: {
        backgroundColor: '#67E',
        borderBottomWidth: 0
      },
      headerTintColor: '#FFF'

    })
  }

  @computed
  get post() {
    const {postId} = this.props.navigation.state.params
    const post = this.props.feed.getPost(postId)
    if (!post) this.props.feed.refreshPost(postId)
    return post
  }

  // @computed
  // get user() {
  //   if (!this.post) return null
  //   const {userId} = this.post
  //   const user = this.props.people.getUser(userId)
  //   if (!user) this.props.people.refreshUser(userId)
  //   return user
  // }

  render() {
    if (!this.post /*|| !this.user*/) return <Loader/>
    const {
      title,
      text,
      coords,
      timestamp,
      isLiked,
      uid,
      likesNumber,
      location
    } = this.post

    return <Post
      location = {location}
      title = {title}
      text = {text}
      coords = {coords}
      timestamp = {timestamp}
      isLiked = {isLiked}
      uid = {uid}
      likesNumber = {likesNumber}
      user = {this.post.user}
      openLikedPosts = {this.openLikedPosts}
      openMap = {this.openMap}
    />
  }

  openLikedPosts = () => {
    const {postId} = this.props.navigation.state.params
    this.props.navigation.push('likesList', {postId})
  }

  openMap = () => {
    const {coords} = this.post
    this.props.navigation.navigate('mapScreen', {coords})
  }
}

export default PostScreen