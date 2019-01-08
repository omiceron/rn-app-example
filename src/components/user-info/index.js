import React, {Component} from 'react'
import {Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native'
import {observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import Loader from '../common/loader'
import Avatar from '../common/touchable-avatar'
import PropTypes from 'prop-types'
import SegmentedCard from '../common/segmented-card'
import TableRow from '../common/table-row'
import TableSeparator from '../common/table-separator'
import TableView from '../common/table-view'
import {DEFAULT_BACKGROUND_COLOR, FEED_STORE} from '../../constants'

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

  @observable posts = null

  async componentDidMount() {
    this.posts = await this.props.feed.getUserLikedPosts(this.props.user.uid)
  }

  render() {

    const {lastName, firstName, userInfo, email, avatar, uid} = this.props.user
    const {openChatWithUser, openUserAvatarsScreen, openPostScreen} = this.props

    const LeftComponent = () => <Avatar size = {60} onPress = {openUserAvatarsScreen}/>
    const renderLikedPosts = () =>
      <TableView>
        {this.posts.length
          ? this.posts.map(({postId, title}) =>
            <TouchableOpacity key = {postId}
                              onPress = {() => openPostScreen(postId)}>
              <TableRow title = {title}/>
            </TouchableOpacity>)
          : <TableRow title = 'No posts'/>}
      </TableView>

    return <ScrollView style = {styles.container}>

      <TableView>
        <SegmentedCard
          mainContainerStyle = {styles.textView}
          LeftComponent = {LeftComponent}>

          <Text style = {styles.text}>
            {firstName} {lastName}
          </Text>

          <Text style = {[styles.text, styles.status]}>
            online
          </Text>

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

      <TableSeparator/>

      {this.posts ? renderLikedPosts() : <Loader/>}

    </ScrollView>
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR
  },
  simpleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: 'white'
  },
  separator: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 35
  },
  status: {
    color: '#67E'
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
    fontWeight: '100'
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
    color: '#67E',
    textAlign: 'center'
  }
})
export default UserInfo