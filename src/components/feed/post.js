import React, {Component} from 'react'
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import {MapView, Permissions, Location} from 'expo'
import PropTypes from 'prop-types'
import AttachedMap from './attached-map'
import TableView from '../common/table-view'
import TableRow from '../common/table-row'
import {DATE_FORMAT, FEED_STORE, NAVIGATION_STORE, PEOPLE_STORE, REGION_DELTAS} from '../../constants'
import Separator from '../common/separator'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'
import Loader from '../common/loader'
import TouchableAvatar from '../common/touchable-avatar'
import BasicAvatar from '../common/basic-avatar'
import Like from './like'
import LikesCounter from './likes-counter'

@inject(FEED_STORE)
@inject(NAVIGATION_STORE)
@inject(PEOPLE_STORE)
@observer
class Post extends Component {
  static propTypes = {
    post: PropTypes.shape({
      title: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      coords: PropTypes.object
    }).isRequired
  }

  @observable user = null

  async componentWillMount() {
    this.user = await this.props.people.fetchUserInfo(this.props.post.userId)
  }

  render() {
    if (!this.user) return <Loader/>

    const {title, text, coords, timestamp, isLiked, uid, likesNumber} = this.props.post
    const {firstName, lastName} = this.user
    const date = new Date(timestamp).toLocaleDateString('en-GB', DATE_FORMAT)

    const renderMap = () => {
      if (!coords) return null

      return <MapView
        style = {styles.mapView}
        initialRegion = {{...coords, ...REGION_DELTAS}}
      >
        <MapView.Marker
          coordinate = {{...coords}}
        />
      </MapView>

    }

    return <SafeAreaView style = {styles.container}>
      <ScrollView>

        <TableRow>
          <Text style = {styles.title}>
            {title}
          </Text>
        </TableRow>

        <View style = {{
          paddingHorizontal: 15,
          paddingVertical: 8,
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

            }} onPress = {() => this.props.navigation.push('userScreen', {user: this.user})}>
              <Text style = {styles.caption}>
                by <Text style = {{fontWeight: '500'}}>{firstName} {lastName}</Text>
              </Text>

              <BasicAvatar style = {{marginLeft: 3}} size = {20}/>

            </TouchableOpacity>
          </View>

        </View>

        <Separator/>

        <TableRow disableSeparator>
          <Text style = {styles.text}>
            {text}
          </Text>
        </TableRow>

        {renderMap()}

        <Separator/>

        <View style = {{
          paddingHorizontal: 15,
          paddingVertical: 8,
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}>
          <Like
            style = {{marginRight: 4, marginVertical: 4}}
            onPress = {() => this.props.feed.setLike(uid)}
            activated = {isLiked}
          />
          <LikesCounter
            style = {{marginRight: 4, marginVertical: 4}}
            likesNumber = {likesNumber}
            onPress = {() => this.props.navigation.push('likesList', {postId: uid})}/>
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
  },
  mapView: {
    height: 100
  }
})

export default Post