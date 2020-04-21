import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { INACTIVE_TEXT_COLOR } from '../../constants'

class LikesCounter extends PureComponent {
    static propTypes = {
        // style: View.propTypes.style,
        likesNumber: PropTypes.number.isRequired,
        onPress: PropTypes.func,
        isLiked: PropTypes.bool
    }

    render() {
        const { likesNumber, onPress, style, isLiked } = this.props

        if (!likesNumber) return <View style={[styles.container, style]} />

        return (
            <TouchableOpacity onPress={onPress}>
                <View style={[styles.container, style]}>
                    <Text style={[styles.text, { color: isLiked ? '#f40003' : INACTIVE_TEXT_COLOR }]}>
                        {likesNumber}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 34,
        width: 34,
        justifyContent: 'center'
    },
    text: {
        // color: 'rgba(127,127,127,1)',
        fontSize: 16,
        fontWeight: '300'
    }
})

export default LikesCounter
