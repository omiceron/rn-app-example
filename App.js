// @flow

import {configure} from 'mobx'
import {Provider} from 'mobx-react'
import AuthLoadingScreen from './src/components/common/loader'
import React from 'react'
import {StatusBar} from 'react-native'
import {ScreenOrientation} from 'expo'
import {config} from './src/config'
import AppNavigator from './src/components/app-navigator'
import stores from './src/stores'

configure({enforceActions: 'never'})

function concat(a: string, b: string) {
  return a + b
}

concat(123, "123")

export default class App extends React.Component {

  componentDidMount() {
    StatusBar.setBarStyle('light-content', true)
    ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT_UP)
  }

  render() {
    return <Provider {...stores}>
      <AppNavigator ref = {this.setNavRef}/>
    </Provider>
  }

  setNavRef = (ref) => {
    stores.navigation.setRef(ref)
  }

}
