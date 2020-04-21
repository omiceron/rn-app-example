import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import BasicCard from '../common/basic-card'

class AuthRow extends Component {
    static propTypes = {
        // style: View.propTypes.style,
    }

    render() {
        const { style, ...rest } = this.props
        return <BasicCard {...rest} style={[styles.container, style]} />
    }
}

const styles = StyleSheet.create({
    container: {
        height: 50,
        marginVertical: 8,
        marginHorizontal: 8,
        alignItems: 'center',

        borderRadius: 25,
        borderColor: 'rgba(255,255,255, 0.8)',
        borderWidth: StyleSheet.hairlineWidth,

        padding: 0
    }
})

export default AuthRow
