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

    return <SafeAreaView style = {styles.container}>
      <ScrollView style = {{paddingHorizontal: 15}}>

        <View style = {{marginVertical: 8}}>
          <Text style = {styles.title}>
            {title}
          </Text>
        </View>

        <Separator style = {{marginHorizontal: 0}}/>

        <View style = {{
          marginVertical: 4,
          flexDirection: 'row'
        }}>

          <View style = {{
            flex: 1,
            justifyContent: 'center'
          }}>
            <Text style = {styles.caption}>
              {date}
            </Text>
          </View>

          <View style = {{
            flex: 1,
            alignItems: 'flex-end'
          }}>
            <TouchableOpacity style = {{
              flexDirection: 'row',
              alignItems: 'center'

            }} onPress = {() => navigation.push('userScreen', {user})}>
              <Text style = {styles.caption}>
                by <Text style = {{fontWeight: '500'}}>{firstName} {lastName}</Text>
              </Text>

              <BasicAvatar style = {{marginLeft: 3}} size = {20}/>

            </TouchableOpacity>
          </View>

        </View>

        <Separator style = {{marginHorizontal: 0}}/>

        <View style = {{
          marginVertical: 8
        }}>
          <Text style = {styles.text}>
            {text}
          </Text>
        </View>

        {coords && <AttachedMap coords = {coords}/>}

        <Separator style = {{marginHorizontal: 0}}/>

        <View style = {{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}>
          <Like
            style = {{marginRight: 4, marginVertical: 4}}
            onPress = {() => feed.setLike(uid)}
            activated = {isLiked}
          />
          <LikesCounter
            style = {{marginRight: 4, marginVertical: 4}}
            likesNumber = {likesNumber}
            onPress = {() => navigation.push('likesList', {postId: uid})}/>
        </View>

      </ScrollView>
    </SafeAreaView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  title: {
    fontSize: 32,
    fontWeight: '300'
  },
  text: {
    fontSize: 20,
    fontWeight: '200'
  },
  caption: {
    fontSize: 12,
    fontWeight: '100',
    color: 'rgba(127,127,127,1)'
  }
})

export default Post