import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {MapView, Location} from 'expo'
import {REGION_DELTAS} from '../../constants'

class MapScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return ({
      title: 'Location',
    })
  }

  render() {
    const {coords} = this.props.navigation.state.params

    return <MapView
      onPress = {() => this.props.navigation.goBack()}
      style = {styles.container}
      initialRegion = {{
        ...coords,
        ...REGION_DELTAS
      }}
    >
      <MapView.Marker coordinate = {{...coords}}/>
    </MapView>

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default MapScreen