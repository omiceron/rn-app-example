import {View, StyleSheet, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {WHITE_TRANSPARENT_BACKGROUND_COLOR} from '../../constants'

class SocialMedia extends Component {
    static propTypes = {
        onPress: PropTypes.func,
        name: PropTypes.string.isRequired
    }

    render() {
        return (
            <TouchableOpacity onPress={this.props.onPress}>
                <View style={styles.container}>
                    <Icon name={this.props.name} size={30} color={WHITE_TRANSPARENT_BACKGROUND_COLOR} />
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        // backgroundColor: 'white',
        // opacity: .8,
        marginHorizontal: 20,

        // height: 50,
        backgroundColor: 'rgba(255,255,255, 0.1)', //#39F',
        borderColor: 'rgba(255,255,255, 0.8)',
        borderWidth: StyleSheet.hairlineWidth
    }
})

export default SocialMedia
