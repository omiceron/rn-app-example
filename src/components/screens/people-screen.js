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
  openChatScreen = (userId) => {
    const user = this.props.people.getUser(userId)
    this.props.navigation.push('chatScreen', {user, userId})
  }

  openUserInfoScreen = (userId) => {
    this.props.navigation.push('userScreen', {userId})
  }

  getPhoto = (userId) => {
    this.props.navigation.navigate('personPhoto', {userId})
  }
}

export default PeopleListScreen