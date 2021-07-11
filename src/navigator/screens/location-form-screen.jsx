import React, {Component} from 'react'
// import PropTypes from 'prop-types'
import LocationForm from '../../components/location-form'
import {observer, inject} from 'mobx-react'
import {FEED_STORE} from '../../constants'
// import {HeaderBackButton} from 'react-navigation'
import NavigationButton from '../../components/ui/navigation-button'

@inject(FEED_STORE)
@observer
class LocationFormScreen extends Component {
    static propTypes = {}

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Add location',
            headerLeft: () => <NavigationButton title="Cancel" onPress={() => navigation.goBack()} />,
            headerRight: () => <NavigationButton title="Attach" onPress={navigation.getParam('attachLocation')} />
        }
    }

    componentDidMount() {
        const {attachLocation} = this.props.feed
        this.props.navigation.setParams({attachLocation})
    }

    render() {
        return <LocationForm />
    }
}

export default LocationFormScreen
