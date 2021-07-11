import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import BasicSeparator from './basic-separator'
import {SEPARATOR_DEFAULT_MARGIN, SEPARATOR_LINE_COLOR} from '../../../constants'

class LinedSeparator extends Component {
    render() {
        const {style, noMargins, vertical, ...rest} = this.props
        const {container, horizontalIndents, verticalIndents} = styles

        const calculatedStyle = [!noMargins && (vertical ? verticalIndents : horizontalIndents)]

        return (
            <BasicSeparator
                {...rest}
                vertical={vertical}
                style={[container, ...calculatedStyle, style]}
                size={StyleSheet.hairlineWidth}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: SEPARATOR_LINE_COLOR
    },
    horizontalIndents: {
        marginLeft: SEPARATOR_DEFAULT_MARGIN,
        marginRight: SEPARATOR_DEFAULT_MARGIN
    },
    verticalIndents: {
        marginBottom: SEPARATOR_DEFAULT_MARGIN,
        marginTop: SEPARATOR_DEFAULT_MARGIN
    }
})

export default LinedSeparator
