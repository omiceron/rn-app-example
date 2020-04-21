import React, { Component } from 'react'
import { TouchableOpacity, View } from 'react-native'
import BasicAvatar from './basic-avatar'
import PropTypes from 'prop-types'

// TODO: Merge with BasicAvatar?
class TouchableAvatar extends Component {
    static propTypes = {
        onPress: PropTypes.func.isRequired,
        // style: View.propTypes.style,
        uri: PropTypes.string,
        size: PropTypes.number.isRequired
    }

    render() {
        const { onPress, ...rest } = this.props
        return (
            <TouchableOpacity onPress={onPress}>
                <BasicAvatar {...rest} />
            </TouchableOpacity>
        )
    }
}

export default TouchableAvatar
