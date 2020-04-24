import React, {Component} from 'react'
import {inject} from 'mobx-react'
import {FEED_STORE} from '../../constants'
import Post from '../../components/post/post'
import {computed} from 'mobx'
import Loader from '../../components/common/loader'

@inject(FEED_STORE)
class PostScreen extends Component {
    static navigationOptions = () => {
        return {
            title: 'Post'
        }
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

    openLikedPosts = () => {
        const {postId} = this.props.navigation.state.params
        this.props.navigation.push('likesList', {postId})
    }

    openMap = () => {
        const {coords} = this.post
        this.props.navigation.navigate('mapScreen', {coords})
    }

    handleInfoPress = () => {
        this.props.navigation.push('userScreen', {userId: this.post.user.uid})
    }

    render() {
        if (!this.post /*|| !this.user*/) return <Loader />
        const {title, text, coords, timestamp, uid, location, user} = this.post

        return (
            <Post
                location={location}
                title={title}
                text={text}
                coords={coords}
                timestamp={timestamp}
                uid={uid}
                user={user}
                openLikedPosts={this.openLikedPosts}
                openMap={this.openMap}
                handleInfoPress={this.handleInfoPress}
            />
        )
    }
}

export default PostScreen
