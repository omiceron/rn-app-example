import React, {Component} from 'react'
import {FlatList, View, StyleSheet, Text, ActivityIndicator, SafeAreaView} from 'react-native'
import {observer, inject} from 'mobx-react'
import PropTypes from 'prop-types'
import PostCard from './post-card'
import {FEED_STORE, DEFAULT_BACKGROUND_COLOR} from '../../constants'

@inject(FEED_STORE)
@observer
class Feed extends Component {
  static propTypes = {
    feed: PropTypes.shape({
      fetchPosts: PropTypes.func.isRequired,
      loading: PropTypes.bool.isRequired,
      loaded: PropTypes.bool.isRequired,
      setLike: PropTypes.func.isRequired,
      refreshFeed: PropTypes.func.isRequired,
    })
  }

  render() {
    const {fetchPosts, posts, loading, loaded, setLike, refreshFeed} = this.props.feed
    // const {onLikeNumberPress} = this.props

    const renderItem = ({item, item: {title, text, comments, coords, uid, likesNumber, isLiked}}) =>
      <PostCard
        title = {title}
        text = {text}
        coords = {coords}
        likesNumber = {likesNumber}
        // setLike = {setLike}
        isLiked = {isLiked}
        comments = {comments}
        uid = {uid}
        post = {item}
        // onLikeNumberPress = {onLikeNumberPress}
      />

    const ItemSeparatorComponent = () => <View style = {{height: 16}}/>

    return <SafeAreaView style = {styles.container}>
      <FlatList
        data = {posts}
        refreshing = {loading}
        onRefresh = {refreshFeed}
        // ListEmptyComponent = {() => <View><Text>empty</Text></View>}
        onEndReached = {fetchPosts}
        initialNumToRender = {Number.MAX_SAFE_INTEGER}
        onEndReachedThreshold = {0.5}
        renderItem = {renderItem}
        ItemSeparatorComponent = {ItemSeparatorComponent}
      />
      {loaded || loading && <ActivityIndicator/>}
    </SafeAreaView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR
  }
})

export default Feed