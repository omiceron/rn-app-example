import React, {Component, Fragment} from 'react'
import {StyleSheet, SectionList, Text, View, FlatList} from 'react-native'
import PropTypes from 'prop-types'
import {INACTIVE_BACKGROUND_COLOR, INACTIVE_TEXT_COLOR, WHITE_BACKGROUND_COLOR} from '../../../constants'
import BasicSeparator from '../separator/basic-separator'
import LinedSeparator from '../separator/lined-separator'
import TableRow from '../table/table-row'

class List extends Component {
    static propTypes = {
        // style: View.propTypes.style,
        scrollable: PropTypes.bool,
        sections: PropTypes.array.isRequired
    }

    inputs = []

    addInputRef = (ref) => (this.inputs = [...this.inputs, ref])

    focusNextInput = ({target}) => {
        const nextInput = this.inputs.findIndex(({_inputRef}) => _inputRef._nativeTag === target) + 1

        if (nextInput >= this.inputs.length) {
            return
        }

        this.inputs[nextInput].focus()
    }

    renderHint = (hint) => (
        <View style={styles.separator}>
            <Text style={[styles.text, styles.hint]}>{hint}</Text>
        </View>
    )

    renderSectionHeader = ({section: {header}}) =>
        header ? (
            <View style={styles.separator}>
                <Text style={[styles.text, styles.header]}>{header}</Text>
            </View>
        ) : null

    renderSectionSeparatorComponent = ({leadingItem, trailingItem, section: {hint}}) => (
        <Fragment>
            {leadingItem ? <LinedSeparator noMargins /> : null}
            {!trailingItem && hint ? this.renderHint(hint) : null}
            {trailingItem ? (
                <LinedSeparator noMargins />
            ) : (
                <BasicSeparator style={{backgroundColor: INACTIVE_BACKGROUND_COLOR}} size={40} />
            )}
        </Fragment>
    )

    renderItem = ({item: {customComponent: Component, props}, item}) =>
        Component ? (
            <Component {...props} addInputRef={this.addInputRef} focusNextInput={this.focusNextInput} />
        ) : (
            <TableRow {...item} />
        )

    render() {
        const {sections, ...rest} = this.props

        return (
            <SectionList
                {...rest}
                renderSectionHeader={this.renderSectionHeader}
                style={styles.container}
                contentContainerStyle={styles.section}
                renderItem={this.renderItem}
                SectionSeparatorComponent={this.renderSectionSeparatorComponent}
                ItemSeparatorComponent={LinedSeparator}
                keyExtractor={(item) => item.name}
                stickySectionHeadersEnabled={false}
                initialNumToRender={Number.MAX_SAFE_INTEGER}
                sections={sections}
            />
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: INACTIVE_BACKGROUND_COLOR
    },
    section: {
        backgroundColor: WHITE_BACKGROUND_COLOR
    },
    separator: {
        padding: 8,
        backgroundColor: INACTIVE_BACKGROUND_COLOR
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

export default List
