import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import * as Location from 'expo-location'
import MapView from 'react-native-maps'
import { REGION_DELTAS } from '../../constants'
import PropTypes from 'prop-types'

class MapScreen extends Component {
    static propTypes = {
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    coords: PropTypes.object.isRequired
                })
            })
        })
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Location'
        }
    }

    render() {
        const { coords } = this.props.navigation.state.params

        return (
            <MapView
                onPress={() => this.props.navigation.goBack()}
                style={styles.container}
                initialRegion={{
                    ...coords,
                    ...REGION_DELTAS
                }}
            >
                <MapView.Marker coordinate={{ ...coords }} />
            </MapView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default MapScreen
