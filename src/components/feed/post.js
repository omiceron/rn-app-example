import React, {Component} from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import {string, object, number, bool, shape} from 'prop-types'
import AttachedMap from './attached-map'
import {FEED_STORE, INACTIVE_TEXT_COLOR, NAVIGATION_STORE, OFFLINE_COLOR, BLACK_TEXT_COLOR} from '../../constants'
import Separator from '../common/separator'
import {inject, observer} from 'mobx-react'
import BasicAvatar from '../common/basic-avatar'
import {getDate} from '../../stores/utils'
import AttachedLocation from './attached-location'
import PostControlRow from './post-control-row'

@inject(FEED_STORE)
@inject(NAVIGATION_STORE)
@observer
class Post extends Component {
  static propTypes = {
    title: string.isRequired,
    text: string.isRequired,
    coords: object,
    location: string,
    timestamp: number.isRequired,
    isLiked: bool.isRequired,
    uid: string.isRequired,
    likesNumber: number.isRequired,
    user: shape({
      firstName: string,
      lastName: string
    }).isRequired
  }

  render() {
    const {
      location,
      title,
      text,
      coords,
      timestamp,
      isLiked,
      uid: postId,
      likesNumber,
      user: {
        firstName,
        lastName,
        uid: userId
      },
      navigation,
      feed
    } = this.props

    const date = getDate(timestamp)

    const PostSeparator = () => <Separator style = {styles.postSeparator}/>
    // TODO: user object
    const PostInfo = () => (
      <View style = {styles.postInfoContainer}>

        <View style = {styles.date}>
          <Text style = {styles.caption}>
            {date}
          </Text>
        </View>

        <TouchableOpacity style = {styles.authorButton} onPress = {() => navigation.push('userScreen', {userId})}>
          <View style = {styles.author}>

            <View style = {styles.authorName}>
              <Text style = {styles.caption} numberOfLines = {1}>
                by <Text style = {styles.name}>{firstName} {lastName}</Text>
              </Text>
            </View>

            <BasicAvatar style = {styles.avatar} size = {20}/>

          </View>
        </TouchableOpacity>

      </View>
    )

    // TODO: Attached location logic must be reordered
    return <SafeAreaView style = {styles.container}>
      <ScrollView style = {styles.scroll}>

        <View style = {styles.row}>
          <Text style = {styles.title}>
            {title}
          </Text>
        </View>

        <PostSeparator/>

        <PostInfo/>

        <PostSeparator/>

        <View style = {styles.row}>
          <Text style = {styles.text}>
            {text}
          </Text>
        </View>

        {location && <AttachedLocation
          location = {location}
          onPress = {this.props.openMap}
        />}

        {coords && <AttachedMap
          coords = {coords}
          onPress = {this.props.openMap}

        />}

        <PostSeparator/>

        <PostControlRow
          isLiked = {isLiked}
          likesNumber = {likesNumber}
          onLikePress = {() => feed.setLike(postId)}
          onCounterPress = {this.props.openLikedPosts}
        />

      </ScrollView>
    </SafeAreaView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scroll: {
    paddingHorizontal: 15
  },
  row: {
    marginVertical: 8
  },
  postInfoContainer: {
    marginVertical: 4,
    flexDirection: 'row'
  },
  date: {
    flex: 1,
    justifyContent: 'center'
  },
  author: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  authorButton: {
    flex: 1
  },
  authorName: {
    flex: 1,
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: BLACK_TEXT_COLOR
  },
  text: {
    fontSize: 20,
    fontWeight: '200',
    color: BLACK_TEXT_COLOR

  },
  name: {
    fontWeight: '500'
  },
  caption: {
    fontSize: 12,
    fontWeight: '100',
    color: INACTIVE_TEXT_COLOR
  },
  avatar: {
    marginLeft: 3
  },
  postSeparator: {
    marginHorizontal: 0
  }
})

export default Post