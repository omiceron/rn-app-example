import React, {Component} from 'react'
import {View, StyleSheet, ActivityIndicator} from 'react-native'
import PropTypes from 'prop-types'
import {INACTIVE_BACKGROUND_COLOR} from '../../constants'

class ListLoader extends Component {
    static propTypes = {
        loading: PropTypes.bool
    }

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <ActivityIndicator />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 60,
        justifyContent: 'center',
        backgroundColor: INACTIVE_BACKGROUND_COLOR
    }
})

export default ListLoader
