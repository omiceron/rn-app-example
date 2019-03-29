import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ImageBackground
} from 'react-native'
import PropTypes from 'prop-types'
import Attachment from './attachment'

class Attachments extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  }

  renderItem = (item) => <Attachment {...item} size = {90}/>

  render() {
    return <View style = {styles.container}>
      {this.props.attachments.map(this.renderItem)}
    </View>
  }

}

const styles = StyleSheet.create({
  container: {
    display: 'flex'
  }
})

export default Attachments