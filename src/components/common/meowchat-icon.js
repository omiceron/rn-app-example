import React, {Component} from 'react'
import {Font} from 'expo'
import {createIconSet} from '@expo/vector-icons'

export default class MeowChatIcon extends Component {
  state = {
    fontLoaded: false
  }

  async componentDidMount() {
    await Font.loadAsync({
      'Meowchat': require('../../../assets/fonts/meowchat-icons.ttf')
    })

    this.setState({fontLoaded: true})
  }

  render() {
    if (!this.state.fontLoaded) {
      return null
    }

    const CustomIcon = createIconSet({'cat-outline': '', 'cat': ''}, 'Meowchat')

    return <CustomIcon {...this.props}/>
  }
}