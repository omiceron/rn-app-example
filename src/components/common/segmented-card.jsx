import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import TouchableCard from './touchable-card'
import BasicCard from './basic-card'
import PropTypes from 'prop-types'

class SegmentedCard extends Component {
  static propTypes = {
    LeftComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    RightComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    // mainContainerStyle: View.propTypes.style
  }

  render() {
    const { LeftComponent, RightComponent, mainContainerStyle, ...rest } = this.props

    const left = LeftComponent && (
      <View style={styles.leftSegmentView}>
        <LeftComponent />
      </View>
    )

    const right = RightComponent && (
      <View style={styles.rightSegmentView}>
        <RightComponent />
      </View>
    )

    const Card = rest.onPress ? TouchableCard : BasicCard

    return (
      <Card {...rest}>
        {left}
        <View style={[styles.container, mainContainerStyle]}>{this.props.children}</View>
        {right}
      </Card>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  leftSegmentView: {
    marginRight: 10,
    justifyContent: 'center',
  },
  rightSegmentView: {
    marginLeft: 10,
    width: 50,
    alignItems: 'flex-end',
  },
})

export default SegmentedCard
