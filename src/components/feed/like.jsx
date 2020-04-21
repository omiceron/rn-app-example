import React, {PureComponent, Component} from 'react'
import {View, StyleSheet, Animated, TouchableWithoutFeedback} from 'react-native'
import {reaction} from 'mobx'
import {observer} from 'mobx-react'
import Icon from '../common/meowchat-icon'
import PropTypes from 'prop-types'
import {INACTIVE_TEXT_COLOR} from '../../constants'

@observer
class Like extends Component {
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

    static propTypes = {
        // style: View.propTypes.style,
        activated: PropTypes.bool.isRequired,
        onPress: PropTypes.func.isRequired
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
                        color={activated ? '#f40003' : INACTIVE_TEXT_COLOR}
                        size={30}
                        name={`cat${activated ? '' : '-outline'}`}
                        style={{transform: [{scale: this.interpolation}]}}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 34,
        width: 26,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default Like
