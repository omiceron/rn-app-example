import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {View, StyleSheet, StatusBar} from 'react-native'
import EventList from '../events/event-list'
import Loader from '../common/loader'
// import Loader from '../common/initial-loader'

import Icon from 'react-native-vector-icons/Ionicons'
import {EVENTS_STORE} from '../../constants'

@inject(EVENTS_STORE)
@observer
class EventListScreen extends Component {
    static propTypes = {}

    static navigationOptions = {
        title: 'Events',
        headerStyle: {
            backgroundColor: '#67E',
            borderBottomWidth: 0
        },
        headerTintColor: 'white'
        // tabBarIcon: <Icon name = 'ios-calendar' size = {30}/>
    }

    componentDidMount() {
        // this.props.events.loadAll()
    }

    render() {
        const {events} = this.props
        // return this.getLoader()
        if (events.loading) return this.getLoader()
        // return <EventList/>
        return <EventList onEventPress={this.handleEventPress} />
    }

    getLoader() {
        return <Loader />
    }

    handleEventPress = ({uid, where}) => {
        this.props.navigation.navigate('event', {uid, where})
    }
}

const styles = StyleSheet.create({})

export default EventListScreen
