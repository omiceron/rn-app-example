import React, { Component } from 'react'
import SignIn from '../auth/sign-in'
import { shape, func } from 'prop-types'
import { LayoutAnimation } from 'react-native'

class AuthScreen extends Component {
    static propTypes = {
        navigation: shape({
            navigate: func.isRequired
        })
    }

    // TODO: delete unnecessary LA in loader
    componentDidMount() {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    }

    render() {
        return <SignIn signUp={this.openSignUp} />
    }

    openSignUp = () => {
        this.props.navigation.navigate('signUp')
    }
}

export default AuthScreen
