import React, { Component, PureComponent } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'
import { RectButton } from 'react-native-gesture-handler'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import SegmentedCard from './segmented-card'
import { WHITE_TEXT_COLOR, ROW_HEIGHT, ACTIVE_TINT_COLOR } from '../../constants'

class SwipeableCard extends Component {
    static propTypes = {
        rightActionWidth: PropTypes.number,
        rightActions: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string.isRequired,
                color: PropTypes.string.isRequired,
                callback: PropTypes.func.isRequired
            })
        ),
        leftAction: PropTypes.func,
        onSwipeableLeftOpen: PropTypes.func
    }

    renderLeftActions = (progress, dragX) => {
        const { leftAction } = this.props

        if (!leftAction) return null

        const translateX = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1]
        })

        const onPressHandler = () => {
            this._swipeableRow.close()
            leftAction()
        }

        return (
            <RectButton style={styles.leftAction} onPress={onPressHandler}>
                <Animated.Text style={[styles.actionText, { transform: [{ translateX }] }]}>Archive</Animated.Text>
            </RectButton>
        )
    }

    renderRightAction = (title, color, x, progress, onPress, key, dragX) => {
        const translateX = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [x, 0],
            extrapolate: 'clamp'
        })

        const onPressHandler = () => {
            this._swipeableRow.close()
            onPress()
        }

        return (
            <Animated.View key={key} style={{ flex: 1, transform: [{ translateX }] }}>
                <RectButton style={[styles.rightAction, { backgroundColor: color }]} onPress={onPressHandler}>
                    <Text style={styles.actionText}>{title}</Text>
                </RectButton>
            </Animated.View>
        )
    }

    renderRightActions = (progress, dragX) => {
        const { rightActionWidth = ROW_HEIGHT, rightActions } = this.props

        if (!rightActions) return null

        const width = rightActionWidth * rightActions.length

        return (
            <View style={{ width, flexDirection: 'row' }}>
                {rightActions.map(({ title, color, callback }, i) =>
                    this.renderRightAction(title, color, width - rightActionWidth * i, progress, callback, i, dragX)
                )}
            </View>
        )
    }

    updateRef = (ref) => {
        this._swipeableRow = ref
    }

    close = () => {
        this._swipeableRow.close()
    }

    onSwipeableLeftOpen = () => {
        this.close()
        this.props.onSwipeableLeftOpen()
    }

    render() {
        const {
            children,
            renderLeftActions,
            renderRightActions,
            rightActionWidth,
            rightActions,
            leftAction,
            onSwipeableLeftOpen,
            ...rest
        } = this.props

        return (
            <Swipeable
                ref={this.updateRef}
                // shouldCancelWhenOutside
                friction={1}
                leftThreshold={30}
                rightThreshold={40}
                // overshootLeft = {false}
                // overshootRight = {false}
                onSwipeableLeftOpen={this.onSwipeableLeftOpen}
                renderLeftActions={renderLeftActions || this.renderLeftActions}
                renderRightActions={renderRightActions || this.renderRightActions}
            >
                <SegmentedCard {...rest}>{children}</SegmentedCard>
            </Swipeable>
        )
    }
}

const styles = StyleSheet.create({
    leftAction: {
        flex: 1,
        backgroundColor: ACTIVE_TINT_COLOR,
        justifyContent: 'center'
    },
    actionText: {
        color: WHITE_TEXT_COLOR,
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
        fontWeight: '600'
    },
    rightAction: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default SwipeableCard
