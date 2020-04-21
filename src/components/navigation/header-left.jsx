import React, { Component, PureComponent } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import { inject } from 'mobx-react'
import { NAVIGATION_STORE } from '../../constants'

@inject(NAVIGATION_STORE)
class HeaderLeft extends PureComponent {
    static propTypes = {
        onPress: PropTypes.func
    }

    render() {
        const { onPress } = this.props
        return (
            <TouchableOpacity style={styles.header} onPress={onPress || this.props.navigation.goBack}>
                <View style={styles.backButtonIcon}>
                    <Icon name="ios-arrow-back" size={30} color="#FFF" />
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        left: 0,
        bottom: 0,
        top: 0,
        position: 'absolute',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row'
    },
    backButtonIcon: {
        marginLeft: 8,
        marginRight: 8
    }
})

export default HeaderLeft
