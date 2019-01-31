import React, {PureComponent} from 'react'
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// import Icon from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types'

class Like extends PureComponent {
  static propTypes = {
    style: View.propTypes.style,
    activated: PropTypes.bool.isRequired,
    onPress: PropTypes.func.isRequired
  }

  animation = new Animated.Value(0)

  interpolation = this.animation.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [1, 0.9, 1.1, 1]
  })

  likeHandler = () => {
    this.props.onPress()

    Animated.sequence([
      Animated.timing(this.animation, {
        toValue: 1,
        duration: 200
      }),
      Animated.timing(this.animation, {
        toValue: 0,
        duration: 0
      })
    ]).start()

  }

  render() {
    const {activated, style} = this.props

    const AnimatedIcon = Animated.createAnimatedComponent(Icon)

    return <TouchableWithoutFeedback onPress = {this.likeHandler}>
      <View style = {[styles.container, style]}>
        <AnimatedIcon color = {activated ? '#FF0000' : 'rgba(127,127,127,1)'}
                      size = {30}
                      name = {`cat`}
                      // name = {`ios-heart${activated ? '' : '-outline'}`}
                      style = {[{lineHeight: 32}, {transform: [{scale: this.interpolation}]}]}/>
                      {/*style = {[{lineHeight: 34}, {transform: [{scale: this.interpolation}]}]}/>*/}
      </View>
    </TouchableWithoutFeedback>
  }
}

const styles = StyleSheet.create({
  container: {
    height: 34,
    width: 34,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Like