import React, {Component} from 'react'
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'
import {HIT_SLOP} from '../../constants'

class TouchableText extends Component {
    static propTypes = {
        onPress: PropTypes.func,
        title: PropTypes.string.isRequired,
        caption: PropTypes.string
        // style: View.propTypes.style
    }

    render() {
        const {onPress, title, caption, style} = this.props
        return (
            <View style={styles.container}>
                <Text style={style}>{caption}</Text>
                <TouchableOpacity hitSlop={HIT_SLOP} onPress={onPress}>
                    <Text style={[style, styles.bold]}>{title}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginVertical: 8
    },
    bold: {
        fontWeight: '600',
        margin: 4
    }
})

export default TouchableText
