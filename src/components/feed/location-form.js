import React, {Component} from 'react'
import {View, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView} from 'react-native'
import {array, string, func, shape, objectOf, number, object} from 'prop-types'
import {MapView, Permissions, Location} from 'expo'
import TableView from '../common/table-view'
import TableRow from '../common/table-row'
import Icon from 'react-native-vector-icons/Ionicons'
import {observer, inject} from 'mobx-react'
import {
  BLACK_TEXT_COLOR, FEED_STORE, HIT_SLOP, INACTIVE_TEXT_COLOR, NAVIGATION_STORE,
  REGION_DELTAS
} from '../../constants'
import {observable, action} from 'mobx'
import Loader from '../common/loader'

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
  @action setPermissionGranted = granted => this.permissionGranted = granted

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

  handleSubmit = async () => {
    const coords = await this.props.feed.getCoordsFromAddress()
    if (!coords) return
    this.map.animateToRegion({...coords})
  }

  render() {
    const {coords, setAddress, getCoordsFromAddress, address, setCoords} = this.props.feed

    if (!coords) return <Loader/>

    const renderIcon = () => <TouchableOpacity onPress = {this.handleSubmit} hitSlop = {HIT_SLOP}>
      <Icon color = {INACTIVE_TEXT_COLOR} size = {16} name = 'ios-pin'/>
    </TouchableOpacity>

    return <TableView style = {styles.container}>

      <TableRow>
        <TextInput
          style = {[styles.text]}
          placeholder = 'Type your address here'
          returnKeyType = 'search'
          value = {address}
          onChangeText = {setAddress}
          blurOnSubmit
          onSubmitEditing = {this.handleSubmit}
          // onSubmitEditing = {getCoordsFromAddress}
        />
      </TableRow>

      <KeyboardAvoidingView
        style = {styles.container}
        behavior = 'padding'
        enabled
      >
        <MapView
          ref = {ref => this.map = ref}
          style = {styles.container}
          initialRegion = {{...coords, ...REGION_DELTAS}}
          // region = {{...coords, ...REGION_DELTAS}}
        >
          <MapView.Marker
            draggable
            coordinate = {{...coords}}
            onDragEnd = {(e) => setCoords(e.nativeEvent.coordinate)}
          />
        </MapView>
      </KeyboardAvoidingView>

    </TableView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    fontSize: 16,
    fontWeight: '100',
    color: BLACK_TEXT_COLOR
  }
})

export default LocationForm