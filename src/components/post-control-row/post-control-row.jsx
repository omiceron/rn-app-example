import {computed} from 'mobx'
import React, {Component} from 'react'
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import Like from '../ui/like'
import LikesCounter from '../ui/like/likes-counter'
import {string, object} from 'prop-types'
import {inject, observer} from 'mobx-react'
import {FEED_STORE, NAVIGATION_STORE} from '../../constants'

// import Icon from 'react-native-vector-icons/Ionicons'

@inject(FEED_STORE)
@inject(NAVIGATION_STORE)
@observer
class PostControlRow extends Component {
    static propTypes = {
        postId: string.isRequired,
        feed: object,
        navigation: object
    }

    @computed get likesNumber() {
        const {feed, postId} = this.props

        return feed.getPostLikesNumber(postId)
    }

    @computed get isLiked() {
        const {feed, postId} = this.props

        return feed.isPostLiked(postId)
    }

    handleLikePress = () => {
        const {feed, postId} = this.props

        feed.setLike(postId)
    }

    handleCounterPress = () => {
        const {navigation, postId} = this.props

        navigation.push('likesList', {postId})
    }

    // renderComments = () => {
    //   return <Icon color = 'rgba(127,127,127,1)' size = {30} name = 'ios-text-outline' style = {styles.icon}/>
    // }

    render() {
        console.log('render post-control-row')
        return (
            <View style={styles.container}>
                <Like style={styles.button} onPress={this.handleLikePress} activated={this.isLiked} />
                <LikesCounter
                    style={styles.button}
                    likesNumber={this.likesNumber}
                    isLiked={this.isLiked}
                    onPress={this.handleCounterPress}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    button: {
        marginRight: 4
    }
})

export default PostControlRow
