import React, {Component} from 'react'
import Loader from '../common/loader'
import {AsyncStorage, ImageBackground, StyleSheet} from 'react-native'
// import BackgroundImage from '../common/background-image'
// import image from '../../../assets/images/splash.png'

class AuthLoadingScreen extends Component {
  componentWillMount() {
    this.bootstrapAsync()
  }

  bootstrapAsync = async () => {
    const user = await AsyncStorage.getItem('user')
    const initialRouteName = user ? 'app' : 'auth'
    this.props.navigation.navigate(initialRouteName)
  }

  render() {
    return <Loader/>
    // return <BackgroundImage/>
    // return <View style = {{backgroundColor: 'black', flex: 1}}/>
    // return <ImageBackground
      // source = {image}
      // source = {require('../../../assets/images/splash.png')}
      // style = {styles.container}
    // />
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000'
  },
})

export default AuthLoadingScreen