import React, {Component} from 'react'
import BackgroundImage from './background-image'

class SlideShow extends Component {

  render() {
    const {onPress, uri} = this.props
    return <BackgroundImage onPress = {onPress} uri = {uri}/>
  }
}

export default SlideShow