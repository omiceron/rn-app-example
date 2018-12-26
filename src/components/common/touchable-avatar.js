import React, {Component} from 'react'
import {TouchableOpacity} from 'react-native'
import BasicAvatar from './basic-avatar'
import PropTypes from 'prop-types'

// merge with BasicAvatar?
class TouchableAvatar extends Component {
  static propTypes = {
    onPress: PropTypes.func.isRequired
  }

  render() {
    const {onPress, ...rest} = this.props
    return <TouchableOpacity onPress = {onPress}>
      <BasicAvatar {...rest}/>
    </TouchableOpacity>
  }
}

export default TouchableAvatar