import React, {Component} from 'react'
import SignIn from '../auth/sign-in'
import {shape, func} from 'prop-types'

class AuthScreen extends Component {
  static propTypes = {
    navigation: shape({
      navigate: func.isRequired
    })
  }

  // componentDidMount() {
  //   this.props.navigation.addListener('willBlur', console.log)
  // }

  render() {
    return <SignIn signUp = {this.handleSignUp}/>
  }

  handleSignUp = () => {
    this.props.navigation.navigate('signUp')
  }
}

export default AuthScreen
