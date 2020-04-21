import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import MapView from 'react-native-maps'
import { REGION_DELTAS } from '../../constants'

class AttachedMap extends Component {
  static propTypes = {
    coords: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }).isRequired,
    onPress: PropTypes.func,
  }

  render() {
    const { coords, onPress, style } = this.props

    if (!coords) return null

    return (
      <MapView
        style={[styles.container, style]}
        onPress={onPress}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        scrollEnabled={false}
        cacheEnabled={true}
        // onMapReady = {e => console.log('ready')}
        region={{ ...coords, ...REGION_DELTAS }}
      >
        {/*<MapView.Marker coordinate = {{...coords}}/>*/}
      </MapView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    borderRadius: 10,
  },
})

export default AttachedMap
