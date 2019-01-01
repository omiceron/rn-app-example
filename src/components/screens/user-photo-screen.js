import React, {Component} from 'react'
import Photo from '../common/photo'
import {inject} from 'mobx-react'
import {AVATAR_STORE} from '../../constants'
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
      backgroundColor: '#E67'
    }
  })

  render() {
    return <Photo photoHandler = {this.getPhoto.bind(this)}/>
  }

  getPhoto(photo) {
    this.props.avatar.takePhoto(photo)
  }

}

export default UserPhotoScreen