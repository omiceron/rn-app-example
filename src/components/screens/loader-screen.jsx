import React, {Component} from 'react'
import {AsyncStorage, ImageBackground, StyleSheet} from 'react-native'
import {SplashScreen} from 'expo'
import image from '../../../assets/images/splash.png'
import {WHITE_BACKGROUND_COLOR} from '../../constants'
import {LayoutAnimation} from 'react-native'

class AuthLoadingScreen extends Component {
    componentDidMount() {
        this.bootstrapAsync()
    }

    bootstrapAsync = async () => {
        const user = await AsyncStorage.getItem('meowchat:store:currentUser')
        // const initialRouteName = user ? 'Example' : 'auth'
        const initialRouteName = user ? 'app' : 'auth'
        this.props.navigation.navigate(initialRouteName)
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        SplashScreen.hide()
    }

    render() {
        return <ImageBackground source={image} resizeMode="contain" style={styles.container} />
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE_BACKGROUND_COLOR
    }
})

export default AuthLoadingScreen
