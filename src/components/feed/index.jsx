import React, { Component } from 'react'
import { FlatList, View, StyleSheet, SafeAreaView, LayoutAnimation } from 'react-native'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import PostCard from './post-card'
import { FEED_STORE, INACTIVE_BACKGROUND_COLOR } from '../../constants'
import { reaction } from 'mobx'
import ListLoader from '../common/list-loader'

@inject(FEED_STORE)
@observer
class Feed extends Component {
    static propTypes = {
        feed: PropTypes.shape({
            fetchPosts: PropTypes.func.isRequired,
            loading: PropTypes.bool.isRequired,
            loaded: PropTypes.bool.isRequired,
            setLike: PropTypes.func.isRequired,
            refreshFeed: PropTypes.func.isRequired
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

    renderItem = ({ item: { likes, ...props } }) => <PostCard {...props} />

    render() {
        const { feed } = this.props
        // const {onLikeNumberPress} = this.props

        // const ItemSeparatorComponent = () => <View style = {{height: 4}}/>

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
                    // ItemSeparatorComponent = {ItemSeparatorComponent}
                    // ListHeaderComponent = {<View style = {{height: 8}}/>}
                />
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: INACTIVE_BACKGROUND_COLOR
    }
})

export default Feed