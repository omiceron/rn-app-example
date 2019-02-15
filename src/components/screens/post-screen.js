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

  @observable user = null
  @observable post = null

  // @computed get post() {
  //   const {postId} = this.props.navigation.state.params
  //   return this.props.feed.getPost(postId) /*|| this.props.feed.fetchPost(postId)*/
  // }

  // TODO: Deal with this imperative/declarative dilemma

  async componentDidMount() {
    const {postId} = this.props.navigation.state.params

    reaction(
      () => this.props.feed.getPost(postId),
      async () => this.post = this.props.feed.getPost(postId) || await this.props.feed.fetchPost(postId)
    )
    this.post = this.props.feed.getPost(postId) || await this.props.feed.fetchPost(postId)
    const {userId} = this.post
    this.user = await this.props.people.fetchUserInfo(userId)
  }

  render() {
    if (!this.user || !this.post) return <Loader/>
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
      user = {this.user}
    />
  }
}

export default PostScreen