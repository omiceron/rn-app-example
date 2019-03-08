import React, {Component} from 'react'
import Photo from '../common/photo'
import {inject} from 'mobx-react'
import {AVATAR_STORE, WARNING_COLOR} from '../../constants'
import PropTypes from 'prop-types'

@inject(AVATAR_STORE)
class UserPhotoScreen extends Component {
  static propTypes = {
    avatar: PropTypes.shape({
      takePhoto: PropTypes.func.isRequired
    })
  }

  static navigationOptions = ({navigation}) => ({
    header: null,
    headerStyle: {
      backgroundColor: WARNING_COLOR
    }
  })

  render() {
    return <Photo photoHandler = {this.props.avatar.takePhoto}/>
  }

}

export default UserPhotoScreen