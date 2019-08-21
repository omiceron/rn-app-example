import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import PropTypes from 'prop-types'

class BasicColumn extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
    // separator: PropTypes.function,
  }

  render() {
    const {children, separator: SeparatorComponent, style, ...rest} = this.props
    const childrenArray = React.Children.toArray(children)

    return (
      <View {...rest} style = {[styles.container, style]}>
        {childrenArray.map((child, index) => (
          <React.Fragment key = {child.props.id || index}>
            {React.cloneElement(child)}
            {SeparatorComponent && index !== childrenArray.length - 1 && <SeparatorComponent/>}
          </React.Fragment>
        ))}
      </View>
    )

  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    overflow: 'hidden'
  }
})

export default BasicColumn