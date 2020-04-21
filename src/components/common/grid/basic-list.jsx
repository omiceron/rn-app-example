import React, {Component} from 'react'
import {ScrollView, StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'

class BasicList extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
        scrollable: PropTypes.bool
        // separator: PropTypes.function,
    }

    render() {
        const {children, scrollable, separator: Separator, style, ...rest} = this.props
        const childrenArray = React.Children.toArray(children)
        const ViewComponent = scrollable ? ScrollView : View

        return (
            <ViewComponent {...rest} style={[styles.container, style]}>
                {childrenArray.map((child, index) => (
                    <React.Fragment key={child.props.id || index}>
                        {React.cloneElement(child)}
                        {!child.props.disableSeparator && Separator && index !== childrenArray.length - 1 && (
                            <Separator />
                        )}
                    </React.Fragment>
                ))}
            </ViewComponent>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        overflow: 'hidden'
    }
})

export default BasicList
