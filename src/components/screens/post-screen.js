import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {FEED_STORE} from '../../constants'
import Post from '../feed/post'

@inject(FEED_STORE)
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

  render() {
    return <Post post = {this.props.feed.getPost(this.props.navigation.state.params.postId)}/>
  }
}

export default PostScreen