import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {OFFLINE_COLOR} from '../../constants'
import {styles} from './styles'

class AttachedLocation extends Component {
    static propTypes = {
        location: PropTypes.string.isRequired,
        onPress: PropTypes.func,
        disableIcon: PropTypes.bool
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={[styles.container, this.props.style]}>
                    {this.props.disableIcon ? null : (
                        <View style={styles.iconContainer}>
                            <Icon size={16} color={OFFLINE_COLOR} name="ios-pin" />
                        </View>
                    )}

                    <View style={styles.textContainer}>
                        <Text style={styles.text} numberOfLines={1}>
                            {this.props.location}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default AttachedLocation
