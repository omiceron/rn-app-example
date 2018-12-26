import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import Feed from '../feed/'
import {FEED_STORE} from '../../constants/index'
import Loader from '../common/loader'
import NavigationButton from '../navigation/navigation-button'
import PropTypes from 'prop-types'

@inject(FEED_STORE)
@observer
class FeedScreen extends Component {
  static propTypes = {
    feed: PropTypes.shape({
      posts: PropTypes.array.isRequired,
      loading: PropTypes.bool.isRequired,
    })
  }

  static navigationOptions = ({navigation}) => {
    return ({
      title: 'Feed',
      headerStyle: {
        backgroundColor: '#67E',
        borderBottomWidth: 0
      },
      headerTintColor: '#FFF',
      headerRight: <NavigationButton icon = 'ios-add' onPress = {() => navigation.navigate('postForm')}/>
    })
  }

  // handleOnLikeNumberPress = (postId) => {
  //   this.props.navigation.push('likesList', {postId})
  // }

  render() {
    const {feed: {posts, loading}} = this.props

    if (loading && !posts.length) return <Loader/>

    return <Feed /*onLikeNumberPress = {this.handleOnLikeNumberPress}*//>
  }

}

export default FeedScreen