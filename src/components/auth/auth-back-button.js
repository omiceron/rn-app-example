import React, {Component} from 'react'
import {View, StyleSheet, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import {HIT_SLOP, NAVIGATION_STORE, BACK_BUTTON_HEIGHT} from "../../constants"

@inject(NAVIGATION_STORE)
@observer
class AuthBackButton extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      goBack: PropTypes.func.isRequired,
    })
  }

  render() {
    return <View style = {styles.backButton}>
      <TouchableOpacity
        style = {{width: 30}}
        hitSlop = {HIT_SLOP}
        onPress = {this.props.navigation.goBack}>
        <Icon style = {{lineHeight: 37}} name = 'ios-close' size = {50} color = '#FFF'/>
      </TouchableOpacity>
    </View>
  }
}

const styles = StyleSheet.create({
  backButton: {
    padding: 6,
    height: BACK_BUTTON_HEIGHT,
    zIndex: 100,
    alignSelf: 'flex-start'
  }
})

export default AuthBackButton