import {configure} from 'mobx'
import {Provider} from 'mobx-react'
import React from 'react'
import {StatusBar} from 'react-native'
import {ScreenOrientation} from 'expo'
import {config} from './src/config'
import AppNavigator from './src/components/app-navigator'
import stores from './src/stores'

configure({enforceActions: 'never'})

export default class App extends React.Component {

  componentWillMount() {
    StatusBar.setBarStyle('light-content', true)
    ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT_UP)
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
