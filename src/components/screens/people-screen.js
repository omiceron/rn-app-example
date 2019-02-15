import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import PeopleList from '../people/people-list'
import Loader from '../common/loader'
import {PEOPLE_STORE} from '../../constants'

@inject(PEOPLE_STORE)
@observer
class PeopleListScreen extends Component {
  static navigationOptions = {
    title: 'People',
    headerStyle: {
      backgroundColor: '#67E',
      borderBottomWidth: 0

    },
    headerTintColor: '#FFF'
  }

  componentWillMount() {
    const {people} = this.props
    if (!people.loaded && !people.loading) people.fetchPeople()
  }

  render() {
    const {loading} = this.props.people
    if (loading) return <Loader/>

    return <PeopleList
      openChatScreen = {this.openChatScreen}
      getPhoto = {this.getPhoto}
      openUserInfoScreen = {this.openUserInfoScreen}
    />
  }

  // TODO: remove user parameter
  // TODO: chatId?
  openChatScreen = (user) => {
    const userId = user.uid
    this.props.navigation.push('chatScreen', {user, userId})
  }

  openUserInfoScreen = (user) => {
    const userId = user.uid
    this.props.navigation.push('userScreen', {user, userId})
  }

  getPhoto = (userId) => {
    this.props.navigation.navigate('personPhoto', {userId})
  }
}

export default PeopleListScreen