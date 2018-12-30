import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {observer, inject} from 'mobx-react'
import LikesList from '../feed/likes-list'
import {observable} from 'mobx'
import Loader from '../common/loader'
import {FEED_STORE} from '../../constants'

@inject(FEED_STORE)
@observer
class LikesListScreen extends Component {
  static propTypes = {
    feed: PropTypes.shape({
      attachLocation: PropTypes.func.isRequired,
      getPostLikes: PropTypes.func.isRequired
    }),
    navigation: PropTypes.shape({
      state: PropTypes.shape({
        params: PropTypes.shape({
          postId: PropTypes.string.isRequired
        })
      })
    })
  }

  static navigationOptions = ({navigation}) => {
    return ({
      title: 'Likes',
      headerStyle: {
        backgroundColor: '#67E',
        borderBottomWidth: 0
      },
      headerTintColor: '#FFF'
    })
  }

  @observable likes = null
  // @observable error = false

  async componentWillMount() {
    const {attachLocation, getPostLikes} = this.props.feed
    const {state: {params: {postId}}, setParams} = this.props.navigation

    this.likes = await getPostLikes(postId)
    // .catch(action(e => {
    //   this.error = true
    //   return null
    // }))

    setParams({attachLocation})
  }

  render() {
    // if (this.error) return null
    if (!this.likes) return <Loader/>

    return <LikesList openUserInfoScreen = {this.openUserInfoScreen}
                      likes = {this.likes}/>
  }

  openUserInfoScreen = (user) => {
    this.props.navigation.push('userScreen', {user})
  }
}

export default LikesListScreen