import {configure, observable, action} from 'mobx'
import {Provider, observer} from 'mobx-react'
import React from 'react'
import {StatusBar, AsyncStorage} from 'react-native'
import {ScreenOrientation, AppLoading, Font, Asset} from 'expo'
import {config} from './src/config'
import AppNavigator from './src/components/app-navigator'
import stores from './src/stores'

configure({enforceActions: 'never'})

@observer
export default class App extends React.Component {

  @observable isReady = false
  @action setReady = () => this.isReady = true

  @action _loadAssetsAsync = async () => {
    StatusBar.setBarStyle('light-content', true)
    await ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT_UP)
    await Font.loadAsync({
      'Meowchat': require('./assets/fonts/meowchat-icons.ttf')
    })

    await Asset.fromModule(require('./assets/images/splash.png')).downloadAsync()
    await Asset.fromModule(require('./assets/images/no-photo.png')).downloadAsync()
  }

  render() {
    if (!this.isReady) return <AppLoading
      startAsync = {this._loadAssetsAsync}
      onFinish = {this.setReady}
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
