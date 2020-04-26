import React, {Component} from 'react'
import {View, StyleSheet, ActivityIndicator} from 'react-native'
import {INACTIVE_BACKGROUND_COLOR} from '../../constants'

class Loader extends Component {
    static propTypes = {}

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="small" />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: INACTIVE_BACKGROUND_COLOR,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Loader
