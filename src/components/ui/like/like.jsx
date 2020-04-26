import {reaction} from 'mobx'
import {observer} from 'mobx-react'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Animated, TouchableWithoutFeedback, View} from 'react-native'
import {INACTIVE_TEXT_COLOR, LIKE_COLOR} from '../../../constants'
import Icon from '../meowchat-icon'
import {styles} from './styles'

@observer
class Like extends Component {
    static propTypes = {
        // style: View.propTypes.style,
        activated: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired
    }

    constructor(...args) {
        super(...args)

        reaction(
            () => this.props.activated,
            () =>
                Animated.sequence([
                    Animated.timing(this.animation, {
                        toValue: 1,
                        duration: 200
                    }),
                    Animated.timing(this.animation, {
                        toValue: 0,
                        duration: 0
                    })
                ]).start()
        )
    }

    animation = new Animated.Value(0)

    interpolation = this.animation.interpolate({
        inputRange: [0, 0.1, 0.9, 1],
        outputRange: [1, 0.9, 1.1, 1]
    })

    render() {
        const {activated, style, onPress} = this.props

        const AnimatedIcon = Animated.createAnimatedComponent(Icon)

        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={[styles.container, style]}>
                    <AnimatedIcon
                        color={activated ? LIKE_COLOR : INACTIVE_TEXT_COLOR}
                        size={30}
                        name={`cat${activated ? '' : '-outline'}`}
                        style={{transform: [{scale: this.interpolation}]}}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

export default Like
