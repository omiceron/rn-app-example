import React, {Component} from 'react'
import {Text, TouchableOpacity, StyleSheet, ScrollView, View} from 'react-native'
import {observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import Loader from '../common/loader'
import Avatar from '../common/touchable-avatar'
import PropTypes from 'prop-types'
import SegmentedCard from '../common/segmented-card'
import TableRow from '../common/table-row'
import TableSeparator from '../common/table-separator'
import TableView from '../common/table-view'
import {
  INACTIVE_BACKGROUND_COLOR, DEFAULT_HEADER_COLOR, FEED_STORE, HIGHLIGHTED_TEXT_COLOR, OFFLINE_COLOR,
  BLACK_TEXT_COLOR,
  WHITE_BACKGROUND_COLOR
} from '../../constants'
import {getDate, getTime} from '../../stores/utils'

@inject(FEED_STORE)
@observer
class UserInfo extends Component {
  static propTypes = {
    user: PropTypes.shape({
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string,
      userInfo: PropTypes.string,
      email: PropTypes.string,
      avatar: PropTypes.string
    }),
    openChatWithUser: PropTypes.func.isRequired,
    openUserAvatarsScreen: PropTypes.func.isRequired,
    openPostScreen: PropTypes.func.isRequired
  }

  @observable likes = null
  @observable posts = null

  async componentDidMount() {
    this.likes = await this.props.feed.getUserLikedPosts(this.props.user.uid)
    this.posts = await this.props.feed.getUserPosts(this.props.user.uid)

  }

  LeftComponent = () => <Avatar
    size = {60}
    onPress = {this.props.openUserAvatarsScreen}
    uri = {this.props.user.avatar}
  />


  render() {

    const {lastName, firstName, userInfo, email, avatar, uid, online} = this.props.user
    const {openChatWithUser, openUserAvatarsScreen, openPostScreen} = this.props

    const renderLikedPosts = () =>
      <TableView>
        {this.likes.length
          ? this.likes.map(({postId, title}) =>
            <TouchableOpacity key = {postId}
                              onPress = {() => openPostScreen(postId)}>
              <TableRow title = {title}/>
            </TouchableOpacity>)
          : <TableRow title = 'No liked posts'/>}
      </TableView>

    const renderPosts = () =>
      <TableView>
        {this.posts.length
          ? this.posts.map(({postId, title}) =>
            <TouchableOpacity key = {postId}
                              onPress = {() => openPostScreen(postId)}>
              <TableRow title = {title}/>
            </TouchableOpacity>)
          : <TableRow title = 'No posts'/>}
      </TableView>

    const Status = () => {
      if (!online) return null

      let status = ''
      let style

      if (typeof online === 'number') {
        status = 'last seen ' + getDate(online, {short: true}) + ' at ' + getTime(online)
        style = styles.offline
      } else {
        status = 'online'
        style = styles.online
      }

      return <Text style = {[styles.text, style]}>
        {status}
      </Text>
    }

    return <ScrollView style = {styles.container}>

      <TableView>
        <SegmentedCard
          mainContainerStyle = {styles.textView}
          LeftComponent = {this.LeftComponent}>

          <View>
            <Text style = {styles.text}>
              {firstName} {lastName}
            </Text>
          </View>

          <View>
            <Status/>
          </View>

        </SegmentedCard>
      </TableView>

      <TableSeparator/>

      <TableView>
        {userInfo && <TableRow title = {userInfo} caption = "user info"/>}
        {email && <TableRow title = {email} caption = "user e-mail"/>}
      </TableView>

      <TableSeparator/>

      <TableView>
        <TableRow
          title = 'Send message'
          titleStyle = {styles.blueButton}
          onPress = {openChatWithUser}/>
      </TableView>

      <TableSeparator header = 'Liked posts'/>

      {this.likes ? renderLikedPosts() : <Loader/>}

      <TableSeparator header = 'User posts'/>

      {this.posts ? renderPosts() : <Loader/>}

    </ScrollView>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: INACTIVE_BACKGROUND_COLOR
  },
  simpleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: WHITE_BACKGROUND_COLOR
  },
  separator: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 35
  },
  online: {
    color: HIGHLIGHTED_TEXT_COLOR
  },
  offline: {
    color: OFFLINE_COLOR,
  },
  avatar: {
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 35
  },
  text: {
    fontSize: 16,
    fontWeight: '100',
    color: BLACK_TEXT_COLOR
  },
  imageView: {
    flex: 1,
    justifyContent: 'center',
    margin: 10

  },
  textView: {
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 10
  },
  blueButton: {
    color: DEFAULT_HEADER_COLOR,
    textAlign: 'center'
  }
})
export default UserInfo