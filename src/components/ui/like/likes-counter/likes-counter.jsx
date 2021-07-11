import {number, func, bool} from 'prop-types'
import React, {PureComponent} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {INACTIVE_TEXT_COLOR, LIKE_COLOR} from '../../../../constants'
import {styles} from './styles'

class LikesCounter extends PureComponent {
    static propTypes = {
        // style: View.propTypes.style,
        likesNumber: number.isRequired,
        onPress: func,
        isLiked: bool
    }

    render() {
        const {likesNumber, onPress, style, isLiked} = this.props

        if (!likesNumber) {
            return <View style={[styles.container, style]} />
        }

        return (
            <TouchableOpacity onPress={onPress}>
                <View style={[styles.container, style]}>
                    <Text style={[styles.text, {color: isLiked ? LIKE_COLOR : INACTIVE_TEXT_COLOR}]}>
                        {likesNumber}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default LikesCounter
