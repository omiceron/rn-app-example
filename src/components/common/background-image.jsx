import React, {Component} from 'react'
import {ImageBackground, View, StyleSheet, TouchableWithoutFeedback} from 'react-native'
import PropTypes from 'prop-types'
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../constants'

class BackgroundImage extends Component {
    static propTypes = {
        onPress: PropTypes.func,
        children: PropTypes.node,
        uri: PropTypes.string,
        // source: PropTypes.string,
        overlayOpacity: PropTypes.number
    }

    render() {
        const {onPress, uri, overlayOpacity, source, style, ...rest} = this.props

        return (
            <TouchableWithoutFeedback onPress={onPress}>
                <View style={styles.container}>
                    <ImageBackground
                        {...rest}
                        source={
                            source || {uri: uri || `https://picsum.photos/${WINDOW_WIDTH}/${WINDOW_HEIGHT}/?random`}
                        }
                        style={[styles.container, style]}
                    >
                        {overlayOpacity && <View style={[styles.overlay, {opacity: overlayOpacity}]} />}
                        {this.props.children}
                    </ImageBackground>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
        // position: 'relative',
        // width: '100%',
        // height: '100%'
    },
    overlay: {
        backgroundColor: '#000',
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
})

export default BackgroundImage
