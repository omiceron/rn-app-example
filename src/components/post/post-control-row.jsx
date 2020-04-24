import {computed} from 'mobx'
import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import Like from '../like'
import LikesCounter from '../like/likes-counter'
import {string, object} from 'prop-types'
import {inject, observer} from 'mobx-react'
import {FEED_STORE, NAVIGATION_STORE} from '../../constants'

// import Icon from 'react-native-vector-icons/Ionicons'

@inject(FEED_STORE)
@inject(NAVIGATION_STORE)
@observer
class PostControlRow extends Component {
    static propTypes = {
        uid: string.isRequired,
        feed: object,
        navigation: object
    }

    @computed get likesNumber() {
        const {feed, uid} = this.props

        return feed.getPostLikesNumber(uid)
    }

    @computed get isLiked() {
        const {feed, uid} = this.props

        return feed.isPostLiked(uid)
    }

    handleLikePress = () => {
        const {feed, uid} = this.props

        feed.setLike(uid)
    }

    handleCounterPress = () => {
        const {navigation, uid} = this.props

        navigation.push('likesList', {postId: uid})
    }

    // renderComments = () => {
    //   return <Icon color = 'rgba(127,127,127,1)' size = {30} name = 'ios-text-outline' style = {styles.icon}/>
    // }

    render() {
        return (
            <View style={styles.container}>
                <Like style={styles.button} onPress={this.handleLikePress} activated={this.isLiked} />
                <LikesCounter
                    style={styles.button}
                    likesNumber={this.likesNumber}
                    onPress={this.handleCounterPress}
                    isLiked={this.isLiked}
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
        marginRight: 4,
        marginVertical: 4
    }
})

export default PostControlRow
