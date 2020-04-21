import React, { Component } from 'react'
import { ActivityIndicator } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import TouchableAvatar from '../common/touchable-avatar'
import PropTypes from 'prop-types'
import { WHITE_TEXT_COLOR } from '../../constants'

class CurrentUserAvatar extends Component {
    static propTypes = {
        loading: PropTypes.bool.isRequired
    }

    render() {
        const { loading, ...rest } = this.props
        return (
            <TouchableAvatar {...rest}>
                {loading ? <ActivityIndicator /> : <Icon name="ios-camera" size={35} color={WHITE_TEXT_COLOR} />}
            </TouchableAvatar>
        )
    }
}

export default CurrentUserAvatar
