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
    const {loading, loaded, loadAll} = this.props.people
    if (!loaded && !loading) loadAll()
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

  openChatScreen = (user) => {
    this.props.navigation.push('chatScreen', {user})
  }

  openUserInfoScreen = (user) => {
    this.props.navigation.push('userScreen', {user})
  }

  getPhoto = (userId) => {
    this.props.navigation.navigate('personPhoto', {userId})
  }
}

export default PeopleListScreen