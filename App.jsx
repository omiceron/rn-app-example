import {configure, observable, action} from 'mobx'
import {Provider, observer} from 'mobx-react'
import React from 'react'
import {StatusBar, AsyncStorage} from 'react-native'
import {AppLoading} from 'expo'
import * as ScreenOrientation from 'expo-screen-orientation'
import * as Font from 'expo-font'
import {Asset} from 'expo-asset'
import AppNavigator from './src/navigator'
import stores from './src/stores'

configure({enforceActions: 'never'})

@observer
export default class App extends React.Component {

  @observable isReady = false
  @action setReady = () => this.isReady = true

  async componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP)
    await Font.loadAsync({
      'Meowchat': require('./assets/fonts/meowchat-icons.ttf')
    })

    await Asset.fromModule(require('./assets/images/splash.png')).downloadAsync()
    await Asset.fromModule(require('./assets/images/no-photo.png')).downloadAsync()

    this.setReady();
  }

  render() {
    if (!this.isReady) return <AppLoading
      onError = {console.warn}
      autoHideSplash = {false}
    />

    return <Provider {...stores}>
      <AppNavigator ref = {this.setNavRef}/>
    </Provider>
  }

  setNavRef = (ref) => {
    stores.navigation.setRef(ref)
  }

}
