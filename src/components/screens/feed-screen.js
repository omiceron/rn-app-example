import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import Feed from '../feed/'
import {FEED_STORE} from '../../constants/index'
import Loader from '../common/loader'
import NavigationButton from '../navigation/navigation-button'
import PropTypes from 'prop-types'
import {DEFAULT_HEADER_COLOR} from '../../constants'
import EmptyList from '../common/empty-list'

@inject(FEED_STORE)
@observer
class FeedScreen extends Component {
  static propTypes = {
    feed: PropTypes.shape({
      posts: PropTypes.array.isRequired,
      loading: PropTypes.bool.isRequired
    })
  }

  static navigationOptions = ({navigation}) => {
    return ({
      title: 'Feed',
      headerRight: () => <NavigationButton icon = 'ios-add' onPress = {() => navigation.navigate('postForm')}/>
    })
  }

  // handleOnLikeNumberPress = (postId) => {
  //   this.props.navigation.push('likesList', {postId})
  // }

  render() {
    const {posts, loading, loaded} = this.props.feed

    if (!posts.length && (!loaded || loading)) return <Loader/>
    if (!posts.length) return <EmptyList title = {'There are no posts yet...'}/>

    return <Feed/>
    // return <Feed onLikeNumberPress = {this.handleOnLikeNumberPress}/>
  }

}

export default FeedScreen