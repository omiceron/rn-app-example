import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import MapView from 'react-native-maps'
import {REGION_DELTAS} from '../../../../constants'

class AttachedMap extends Component {
    static propTypes = {
        coords: PropTypes.shape({
            latitude: PropTypes.number.isRequired,
            longitude: PropTypes.number.isRequired
        }).isRequired
    }

    render() {
        const {coords} = this.props

        return (
            <View pointerEvents="none">
                <MapView
                    style={styles.map}
                    zoomEnabled={false}
                    rotateEnabled={false}
                    pitchEnabled={false}
                    scrollEnabled={false}
                    cacheEnabled={true}
                    region={{...coords, ...REGION_DELTAS}}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    map: {
        height: 100,
        borderRadius: 10
    }
})

export default AttachedMap
