import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'

class BasicSeparator extends Component {
    static propTypes = {
        // style: View.propTypes.style,
        vertical: PropTypes.bool,
        size: PropTypes.number
    }

    render() {
        const {style, size, vertical, children} = this.props

        const calculatedStyles = [size && (vertical ? {width: size} : {height: size})]

        return <View style={[...calculatedStyles, style]}>{children}</View>
    }
}

export default BasicSeparator
