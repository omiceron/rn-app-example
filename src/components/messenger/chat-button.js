import React, {Component} from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Ionicons'
import {INACTIVE_BACKGROUND_COLOR, USER_MESSAGE_COLOR, WHITE_TEXT_COLOR} from '../../constants'

class ChatButton extends Component {
  static propTypes = {
    isActive: PropTypes.any,
    icon: PropTypes.string.isRequired,
    size: PropTypes.number,
    onPress: PropTypes.func.isRequired
  }

  render() {
    const {isActive = true, icon, size = 30, onPress} = this.props
    const InteractiveComponent = isActive ? TouchableOpacity : View

    return <View style = {styles.container}>
      <InteractiveComponent onPress = {onPress}>
        <View
          style = {[
            styles.button, {
              backgroundColor: isActive ? USER_MESSAGE_COLOR : INACTIVE_BACKGROUND_COLOR
            }]}>
          <Icon name = {icon} size = {size} color = {WHITE_TEXT_COLOR}/>
        </View>
      </InteractiveComponent>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    padding: 8
  },
  button: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 36,
    width: 36,
    borderRadius: 18
  },

})

export default ChatButton