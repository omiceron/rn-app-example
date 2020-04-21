import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { INACTIVE_TEXT_COLOR, TABLE_VIEW_BORDER_COLOR, WHITE_BACKGROUND_COLOR } from '../../../constants'
import LinedSeparator from '../separator/lined-separator'
import BasicList from '../grid/basic-list'
import TableRow from './table-row'

class TableBlock extends Component {
    static propTypes = {
        // style: View.propTypes.style,
        children: PropTypes.node.isRequired,
        scrollable: PropTypes.bool
    }

    renderHint = () => (
        <View style={{ padding: 8 }}>
            <Text style={[styles.text, styles.hint]}>{this.props.hint}</Text>
        </View>
    )

    renderHeader = () => (
        <View style={{ padding: 8 }}>
            <Text style={[styles.text, styles.header]}>{this.props.header}</Text>
        </View>
    )

    render() {
        const { style, children, hint, header, emptyBlockTitle } = this.props
        const count = React.Children.count(children)

        return (
            <View style={style}>
                {header && this.renderHeader()}
                <BasicList style={[styles.container, style]} separator={LinedSeparator}>
                    {count ? children : <TableRow title={emptyBlockTitle} />}
                </BasicList>
                {hint && this.renderHint()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: WHITE_BACKGROUND_COLOR,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: TABLE_VIEW_BORDER_COLOR
    },
    text: {
        fontWeight: '100',
        color: INACTIVE_TEXT_COLOR
    },
    hint: {
        alignSelf: 'center'
    },
    header: {
        alignSelf: 'flex-start'
    }
})

export default TableBlock
