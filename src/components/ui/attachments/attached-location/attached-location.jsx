import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {ScrollView, Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {OFFLINE_COLOR} from '../../../../constants'
import AttachedMap from './attached-map'
import {styles} from './styles'

class AttachedLocation extends Component {
    static propTypes = {
        location: PropTypes.string.isRequired,
        onPress: PropTypes.func,
        disableIcon: PropTypes.bool
    }

    render() {
        const {coords, disableIcon, location, onPress, style} = this.props

        return (
            <TouchableOpacity onPress={onPress}>
                <View style={[styles.container, style]}>
                    {!disableIcon && (
                        <View style={styles.iconContainer}>
                            <Icon size={16} color={OFFLINE_COLOR} name="ios-pin" />
                        </View>
                    )}

                    <View style={styles.textContainer}>
                        <Text style={styles.text} numberOfLines={1}>
                            {location}
                        </Text>
                    </View>
                </View>

                {coords && <AttachedMap coords={coords} />}

                <View style={{marginBottom: 8}} />
            </TouchableOpacity>
        )
    }
}

export default AttachedLocation
