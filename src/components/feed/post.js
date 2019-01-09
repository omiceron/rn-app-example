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
import {DATE_FORMAT, FEED_STORE, NAVIGATION_STORE} from '../../constants'
import Separator from '../common/separator'
import {inject, observer} from 'mobx-react'
import BasicAvatar from '../common/basic-avatar'
import Like from './like'
import LikesCounter from './likes-counter'

@inject(FEED_STORE)
@inject(NAVIGATION_STORE)
@observer
class Post extends Component {
  static propTypes = {
    title: string.isRequired,
    text: string.isRequired,
    coords: object,
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
      title,
      text,
      coords,
      timestamp,
      isLiked,
      uid,
      likesNumber,
      user,
      user: {
        firstName,
        lastName
      },
      navigation,
      feed
    } = this.props

    const date = new Date(timestamp).toLocaleDateString('en-GB', DATE_FORMAT)

    const PostSeparator = () => <Separator style = {{marginHorizontal: 0}}/>

    return <SafeAreaView style = {styles.container}>
      <ScrollView style = {styles.scroll}>

        <View style = {styles.row}>
          <Text style = {styles.title}>
            {title}
          </Text>
        </View>

        <PostSeparator/>

        <View style = {styles.infoBar}>

          <View style = {styles.date}>
            <Text style = {styles.caption}>
              {date}
            </Text>
          </View>

          <View style = {styles.author}>
            <TouchableOpacity style = {styles.authorButton} onPress = {() => navigation.push('userScreen', {user})}>
              <Text style = {styles.caption}>
                by <Text style = {styles.name}>{firstName} {lastName}</Text>
              </Text>

              <BasicAvatar style = {styles.avatar} size = {20}/>

            </TouchableOpacity>
          </View>

        </View>

        <PostSeparator/>

        <View style = {styles.row}>
          <Text style = {styles.text}>
            {text}
          </Text>
        </View>

        {coords && <AttachedMap coords = {coords}/>}

        <PostSeparator/>

        <View style = {styles.controlBar}>
          <Like
            style = {styles.button}
            onPress = {() => feed.setLike(uid)}
            activated = {isLiked}
          />
          <LikesCounter
            style = {styles.button}
            likesNumber = {likesNumber}
            onPress = {() => navigation.push('likesList', {postId: uid})}
          />
        </View>

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
  infoBar: {
    marginVertical: 4,
    flexDirection: 'row'
  },
  date: {
    flex: 1,
    justifyContent: 'center'
  },
  author: {
    flex: 1,
    alignItems: 'flex-end'
  },
  authorButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 32,
    fontWeight: '300'
  },
  text: {
    fontSize: 20,
    fontWeight: '200'
  },
  name: {
    fontWeight: '500'
  },
  caption: {
    fontSize: 12,
    fontWeight: '100',
    color: 'rgba(127,127,127,1)'
  },
  avatar: {
    marginLeft: 3
  },
  controlBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  button: {
    marginRight: 4,
    marginVertical: 4
  }
})

export default Post