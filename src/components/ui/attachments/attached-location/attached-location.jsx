import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {TouchableOpacity} from 'react-native'
import AttachedMap from './attached-map'
import IconText from '../../icon-text'
import BasicList from '../../grid/basic-list'
import BasicSeparator from '../../separator/basic-separator'

class AttachedLocation extends Component {
    static propTypes = {
        location: PropTypes.string.isRequired,
        onPress: PropTypes.func,
        showIcon: PropTypes.bool
    }

    render() {
        const {coords, showIcon, location, onPress, style} = this.props

        return (
            <TouchableOpacity onPress={onPress}>
                <BasicList separator={BasicSeparator}>
                    <IconText text={location} size={16} style={style} icon={showIcon && 'ios-pin'} />

                    {coords && <AttachedMap onPress={onPress} coords={coords} />}
                </BasicList>
            </TouchableOpacity>
        )
    }
}

export default AttachedLocation
