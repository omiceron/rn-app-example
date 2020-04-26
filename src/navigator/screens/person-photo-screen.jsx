import React, {Component} from 'react'
import UsersPhoto from '../../components/users/users-photo'
import {DEFAULT_HEADER_COLOR} from '../../constants'

class PersonPhotoScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        headerShown: false,
        headerStyle: {
            backgroundColor: DEFAULT_HEADER_COLOR
        }
    })

    render() {
        return <UsersPhoto userId={this.props.navigation.state.params.userId} />
    }
}

export default PersonPhotoScreen
