import React, {Component} from 'react'
import {View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView} from 'react-native'
import {Camera, Permissions} from 'expo'
import {observable, action} from 'mobx'
import {observer, inject} from 'mobx-react'
import Icon from 'react-native-vector-icons/Ionicons'
import {NAVIGATION_STORE} from '../../constants'
import PropTypes from 'prop-types'

@inject(NAVIGATION_STORE)
@observer
class Photo extends Component {
  static propTypes = {
    base64: PropTypes.bool,
    photoHandler: PropTypes.func.isRequired
  }

  @observable permitted = false
  @observable errorMessage = null
  @observable type = Camera.Constants.Type.back

  @action setType = (type) => this.type = type
  @action setPermission = (status) => {
    if (status === 'granted') this.permitted = true
    else this.errorMessage = 'permission denied'
  }

  async componentWillMount() {
    StatusBar.setHidden(true, 'slide')

    const res = await Permissions.askAsync(Permissions.CAMERA)
    const {status} = res
    this.setPermission(status)
  }

  async componentWillUnmount() {
    StatusBar.setHidden(false, 'slide')
  }

    renderSnapshotButton() {
    return <TouchableOpacity style = {styles.cameraButton} onPress = {this.takePicture}>
      <View style = {styles.snapshotOuterCircle}>
        <View style = {styles.snapshotInnerCircle}/>
      </View>
    </TouchableOpacity>
  }

  renderCancelButton() {
    return <TouchableOpacity style = {styles.cameraButton} onPress = {this.goBack}>
      <Icon name = 'ios-arrow-back' size = {40} color = '#FFF'/>
    </TouchableOpacity>
  }

  renderFlipButton() {
    return <TouchableOpacity style = {styles.cameraButton} onPress = {this.flipCamera}>
      <Icon name = 'ios-reverse-camera' size = {40} color = '#FFF'/>
    </TouchableOpacity>
  }

  render() {
    if (this.errorMessage) return <SafeAreaView>
      <Text>{this.errorMessage}</Text>
      {this.renderCancelButton()}
    </SafeAreaView>

    if (!this.permitted) return null
    return <Camera style = {styles.container} type = {this.type} ref = {ref => this.camera = ref}>
      <SafeAreaView style = {styles.overlay}>
        <View style = {styles.controls}>
          {this.renderCancelButton()}
          {this.renderSnapshotButton()}
          {this.renderFlipButton()}
        </View>
      </SafeAreaView>
    </Camera>
  }

  flipCamera = () => {
    this.setType(this.type === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back
    )
  }

  takePicture = async () => {
    const {base64, photoHandler} = this.props
    const photo = await this.camera.takePictureAsync({base64, quality: 0.1})

    photoHandler && photoHandler(photo)

    this.goBack()
  }

  goBack = () => {
    // StatusBar.setHidden(false, 'slide')

    this.props.navigation.goBack()
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  cameraButton: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  controls: {
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  snapshotOuterCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 40
  },
  snapshotInnerCircle: {
    width: 50,
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 25
  }
})

export default Photo