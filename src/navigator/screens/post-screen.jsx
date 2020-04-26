import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {FEED_STORE} from '../../constants'
import Post from '../../components/post'
import {computed} from 'mobx'
import Loader from '../../components/ui/loader'

@inject(FEED_STORE)
// @observer
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

        if (!post) {
            this.props.feed.refreshPost(postId)
        }

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

    handleMapPress = () => {
        const {coords} = this.post
        this.props.navigation.navigate('mapScreen', {coords})
    }

    handleInfoPress = () => {
        this.props.navigation.push('userScreen', {userId: this.post.user.uid})
    }

    render() {
        console.log('render post-screen')
        if (!this.post) {
            return <Loader />
        }

        const {coords, location, text, timestamp, title, uid, user} = this.post

        return (
            <Post
                coords={coords}
                location={location}
                text={text}
                timestamp={timestamp}
                title={title}
                uid={uid}
                user={user}
                handleMapPress={this.handleMapPress}
                handleInfoPress={this.handleInfoPress}
            />
        )
    }
}

export default PostScreen
