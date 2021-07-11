import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import UsersList from '../../components/users/users-list'
import Loader from '../../components/ui/loader'
import {USERS_STORE} from '../../constants'
// import {SafeAreaView, ActivityIndicator} from 'react-native'

@inject(USERS_STORE)
@observer
class PeopleListScreen extends Component {
    static navigationOptions = {
        title: 'People'
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

    // TODO: loading behavior must depend on AsyncStorage
    render() {
        const {people} = this.props
        if (!people.size) return <Loader />
        // if (people.loading) return <Loader/>

        // if (people.loading) return <SafeAreaView style = {{flex: 1}}>
        //   <ActivityIndicator/>
        //   <PeopleList
        //     openChatScreen = {this.openChatScreen}
        //     getPhoto = {this.getPhoto}
        //     openUserInfoScreen = {this.openUserInfoScreen}
        //   />
        // </SafeAreaView>

        return (
            <UsersList
                openChatScreen={this.openChatScreen}
                getPhoto={this.getPhoto}
                openUserInfoScreen={this.openUserInfoScreen}
            />
        )
    }
}

export default PeopleListScreen
