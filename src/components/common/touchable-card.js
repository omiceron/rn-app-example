import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {RectButton} from 'react-native-gesture-handler'
import BasicCard from './basic-card'
import PropTypes from 'prop-types'

class TouchableCard extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired,
    onLongPress: PropTypes.func,
    children: PropTypes.node.isRequired
  }

  render() {
    const {onPress, onLongPress, children, ...rest} = this.props

    return <RectButton
      style = {styles.container}
      underlayColor = {'#F6F6F9'}
      onLongPress = {onLongPress}
      onPress = {onPress}
      activeOpacity = {1}
    >
      <BasicCard {...rest}>
        {children}
      </BasicCard>
    </RectButton>
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF'
  }
})

export default TouchableCard