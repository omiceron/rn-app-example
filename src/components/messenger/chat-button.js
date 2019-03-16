import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {INACTIVE_BACKGROUND_COLOR, USER_MESSAGE_COLOR, WHITE_TEXT_COLOR} from '../../constants'
import BasicButton from '../common/basic-button'

class ChatButton extends Component {
  static propTypes = {
    isActive: PropTypes.any,
    icon: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
  }

  render() {
    return <BasicButton
      {...this.props}
      activeBackgroundColor = {USER_MESSAGE_COLOR}
      inactiveBackgroundColor = {INACTIVE_BACKGROUND_COLOR}
      color = {WHITE_TEXT_COLOR}
      size = {30}
    />
  }
}

export default ChatButton