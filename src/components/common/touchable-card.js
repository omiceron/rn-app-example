import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {RectButton} from 'react-native-gesture-handler'
import BasicCard from './basic-card'
import PropTypes from 'prop-types'
import {UNDERLAY_COLOR, WHITE_BACKGROUND_COLOR} from '../../constants'

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
      underlayColor = {UNDERLAY_COLOR}
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
    // TODO
    // backgroundColor: WHITE_BACKGROUND_COLOR
  }
})

export default TouchableCard
