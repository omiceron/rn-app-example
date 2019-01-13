import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {FEED_STORE, PEOPLE_STORE} from '../../constants'
import Post from '../feed/post'
import {observable} from 'mobx'
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

  async componentWillMount() {
    const {postId} = this.props.navigation.state.params
    const {userId} = this.props.feed.entities[postId]

    this.user = await this.props.people.fetchUserInfo(userId)
  }

  render() {
    if (!this.user) return <Loader/>
    const {postId} = this.props.navigation.state.params
    const {
      title,
      text,
      coords,
      timestamp,
      isLiked,
      uid,
      likesNumber
    } = this.props.feed.getPost(postId)
    // } = this.props.feed.entities[postId]

    return <Post
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