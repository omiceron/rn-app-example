import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'
import BasicList from './basic-list'

class BasicRow extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired
        // separator: PropTypes.function,
    }

    render() {
        const { style, children, ...rest } = this.props

        return (
            <BasicList {...rest} style={[styles.container, style]}>
                {children}
            </BasicList>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    }
})

export default BasicRow
