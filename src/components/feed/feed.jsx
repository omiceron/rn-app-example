import {reaction} from 'mobx'
import {inject, observer} from 'mobx-react'
import {bool, func, shape} from 'prop-types'
import React, {Component} from 'react'
import {FlatList, LayoutAnimation, SafeAreaView} from 'react-native'
import {FEED_STORE} from '../../constants'
import ListLoader from '../ui/list-loader'
import PostCard from './post-card'
import {styles} from './styles'

@inject(FEED_STORE)
@observer
class Feed extends Component {
    static propTypes = {
        feed: shape({
            fetchPosts: func.isRequired,
            loading: bool.isRequired,
            loaded: bool.isRequired,
            setLike: func.isRequired,
            refreshFeed: func.isRequired
        })
    }

    constructor(...args) {
        super(...args)

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)

        reaction(
            () => this.props.feed.posts.length,
            () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        )
    }

    renderItem = ({item: {likes, ...props}}) => <PostCard {...props} />

    render() {
        const {feed} = this.props

        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={feed.posts}
                    // refreshing = {feed.loading}
                    // onRefresh = {feed.refreshFeed}
                    onEndReached={feed.fetchPosts}
                    initialNumToRender={Number.MAX_SAFE_INTEGER}
                    onEndReachedThreshold={0.1}
                    renderItem={this.renderItem}
                    ListFooterComponent={feed.loading && ListLoader}
                />
            </SafeAreaView>
        )
    }
}

export default Feed
