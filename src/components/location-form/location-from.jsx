import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import {action, observable} from 'mobx'
import {inject, observer} from 'mobx-react'
import {func, number, shape, string} from 'prop-types'
import React, {Component} from 'react'
import {KeyboardAvoidingView, TextInput} from 'react-native'
import MapView from 'react-native-maps'
import {FEED_STORE, NAVIGATION_STORE, REGION_DELTAS} from '../../constants'
import BasicList from '../ui/basic-list/basic-list'
import Loader from '../ui/loader'
import TableBlock from '../ui/table/table-block'
import TableRow from '../ui/table/table-row'
import {styles} from './styles'

@inject(NAVIGATION_STORE)
@inject(FEED_STORE)
@observer
class LocationForm extends Component {
    static propTypes = {
        feed: shape({
            coords: shape({
                latitude: number.isRequired,
                longitude: number.isRequired
            }),
            attachedCoords: shape({
                latitude: number.isRequired,
                longitude: number.isRequired
            }),
            address: string.isRequired,
            setCoords: func.isRequired,
            setAddress: func.isRequired,
            getCoordsFromAddress: func.isRequired,
            clearLocationForm: func.isRequired
        }),
        navigation: shape({
            goBack: func.isRequired
        })
    }

    @observable permissionGranted = false
    @action setPermissionGranted = (granted) => (this.permissionGranted = granted)

    async componentDidMount() {
        const {attachedCoords, setCoords} = this.props.feed
        const {status} = await Permissions.askAsync(Permissions.LOCATION)
        this.setPermissionGranted(status === 'granted')

        if (!this.permissionGranted) {
            alert('Set permission for this app to use location services!')
            this.props.navigation.goBack()
            return
        }

        if (attachedCoords) {
            setCoords(attachedCoords)
        } else {
            setCoords((await Location.getCurrentPositionAsync()).coords)
        }
    }

    componentWillUnmount() {
        this.props.feed.clearLocationForm()
    }

    // TODO: Check this
    handleSubmit = async () => {
        const coords = await this.props.feed.getCoordsFromAddress()
        if (!coords) return
        this.map.animateToRegion({...coords})
    }

    setMapRef = (ref) => (this.map = ref)

    renderInput = () => {
        const {coords, setAddress, getCoordsFromAddress, address, setCoords} = this.props.feed

        return (
            <TableRow>
                <TextInput
                    style={[styles.text]}
                    placeholder="Type your address here"
                    returnKeyType="search"
                    value={address}
                    onChangeText={setAddress}
                    blurOnSubmit
                    onSubmitEditing={this.handleSubmit}
                    // onSubmitEditing = {getCoordsFromAddress}
                />
            </TableRow>
        )
    }

    renderMap = () => {
        const {coords, setAddress, getCoordsFromAddress, address, setCoords} = this.props.feed

        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <MapView
                    ref={this.setMapRef}
                    style={styles.container}
                    initialRegion={{...coords, ...REGION_DELTAS}}
                    // region = {{...coords, ...REGION_DELTAS}}
                >
                    <MapView.Marker
                        draggable
                        coordinate={{...coords}}
                        onDragEnd={(e) => setCoords(e.nativeEvent.coordinate)}
                    />
                </MapView>
            </KeyboardAvoidingView>
        )
    }

    render2() {
        const {coords, setAddress, getCoordsFromAddress, address, setCoords} = this.props.feed

        if (!coords) return <Loader />

        const sections = [
            {
                data: [
                    {
                        customComponent: this.renderInput,
                        name: 'input'
                    },
                    {
                        customComponent: this.renderMap,
                        name: 'map'
                    }
                ]
            }
        ]

        return <BasicList sections={sections} scrollable={false} />
    }

    render() {
        const {coords, setAddress, getCoordsFromAddress, address, setCoords} = this.props.feed

        if (!coords) return <Loader />

        return (
            <TableBlock disableSeparator style={styles.container}>
                <TableRow>
                    <TextInput
                        style={[styles.text]}
                        placeholder="Type your address here"
                        returnKeyType="search"
                        value={address}
                        onChangeText={setAddress}
                        blurOnSubmit
                        onSubmitEditing={this.handleSubmit}
                        // onSubmitEditing = {getCoordsFromAddress}
                    />
                </TableRow>

                <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                    <MapView
                        ref={this.setMapRef}
                        style={styles.container}
                        initialRegion={{...coords, ...REGION_DELTAS}}
                        // region = {{...coords, ...REGION_DELTAS}}
                    >
                        <MapView.Marker
                            draggable
                            coordinate={{...coords}}
                            onDragEnd={(e) => setCoords(e.nativeEvent.coordinate)}
                        />
                    </MapView>
                </KeyboardAvoidingView>
            </TableBlock>
        )
    }
}

export default LocationForm
