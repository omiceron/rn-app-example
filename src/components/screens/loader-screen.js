import React, {Component} from 'react'
import Loader from '../common/loader'
import {AsyncStorage} from 'react-native'

class AuthLoadingScreen extends Component {
  componentDidMount() {
    this._bootstrapAsync()
  }

  _bootstrapAsync = async () => {
    // AsyncStorage.clear();
    // const user = await this.props.auth.user
    // console.log(user)

    // AsyncStorage.getAllKeys().then(console.log)
    const userToken = await AsyncStorage.getItem('user')
    const initialRouteName = userToken ? 'app' : 'auth'
    this.props.navigation.navigate(initialRouteName)
    // this.props.navigation.navigate(user ? 'app' : 'auth');
  }

  render() {
    return <Loader/>
  }
}

export default AuthLoadingScreen