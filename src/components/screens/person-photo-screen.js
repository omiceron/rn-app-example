import React, {Component} from 'react'
import PersonPhoto from '../people/person-photo'

class PersonPhotoScreen extends Component {
  static navigationOptions = ({navigation}) => ({
    header: null,
    headerStyle: {
      backgroundColor: '#E67'
    }
  })

  render() {
    return <PersonPhoto userId = {this.props.navigation.state.params.userId}/>
  }

}

export default PersonPhotoScreen