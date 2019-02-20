import React, {Component} from 'react'
import PersonPhoto from '../people/person-photo'
import {DEFAULT_HEADER_COLOR} from '../../constants'

class PersonPhotoScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
    headerStyle: {
      backgroundColor: DEFAULT_HEADER_COLOR
    }
  })

  render() {
    return <PersonPhoto userId = {this.props.navigation.state.params.userId}/>
  }

}

export default PersonPhotoScreen