import React, {Component} from 'react'
import {Text, StyleSheet, Button} from 'react-native'
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import MapView from 'react-native-maps'
import {observable, action} from 'mobx'
import {observer, inject} from 'mobx-react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

@observer
class EventMap extends Component {
    static navigationOptions = ({navigation}) => ({
        title: navigation.state.params.where,
        headerBackImage: <Icon name="magnify" size={30} color="#007aff" />
    })

    @observable permissionAsked = false
    @observable permissionGranted = false
    @observable coords = null
    @observable geocode = null

    async componentDidMount() {
        this.setPermissionAsked(true)
        const {status} = await Permissions.askAsync(Permissions.LOCATION)
        const {where} = this.props.navigation.state.params
        this.setPermissionGranted(status === 'granted')
        this.setCoords(await Location.getCurrentPositionAsync())
        this.getGeocode(await Location.geocodeAsync(where))
    }

    @action setPermissionAsked = (asked) => (this.permissionAsked = asked)
    @action setPermissionGranted = (granted) => (this.permissionGranted = granted)
    @action setCoords = ({coords}) => (this.coords = coords)
    @action getGeocode = ([geocode]) => (this.geocode = geocode)

    render() {
        if (/online/gi.test(this.props.navigation.state.params.where)) return <Text>Online</Text>
        if (!this.permissionAsked) return <Text>Not Asked</Text>
        if (!this.permissionGranted) return <Text>Not Granted</Text>
        if (!this.coords) return null
        if (!this.geocode) return null

        return (
            <MapView
                style={styles.container}
                initialRegion={{
                    ...this.geocode,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
            >
                <MapView.Marker coordinate={{...this.geocode}} />
                <Button
                    title="lol"
                    onPress={() => {
                        this.props.navigation.setParams({headerTitle: 'titleText'})
                    }}
                />
            </MapView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default EventMap
