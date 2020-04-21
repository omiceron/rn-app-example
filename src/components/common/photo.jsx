import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView, Image } from 'react-native'
import { Camera } from 'expo-camera'
import * as Permissions from 'expo-permissions'
import { observable, action } from 'mobx'
import { observer, inject } from 'mobx-react'
import Icon from 'react-native-vector-icons/Ionicons'
import { NAVIGATION_STORE, WHITE_TEXT_COLOR } from '../../constants'
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
    @observable pending = false

    @action setType = (type) => (this.type = type)
    @action setPermission = (status) => {
        if (status === 'granted') this.permitted = true
        else this.errorMessage = 'permission denied'
    }

    async componentDidMount() {
        StatusBar.setHidden(true, 'slide')

        const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
        this.setPermission(status)
    }

    async componentWillUnmount() {
        StatusBar.setHidden(false, 'slide')
    }

    renderSnapshotButton() {
        return (
            <TouchableOpacity style={styles.cameraButton} onPress={this.takePicture}>
                <View style={styles.snapshotOuterCircle}>
                    <View style={styles.snapshotInnerCircle} />
                </View>
            </TouchableOpacity>
        )
    }

    renderCancelButton() {
        return (
            <TouchableOpacity style={styles.cameraButton} onPress={this.goBack}>
                <Icon name="ios-arrow-back" size={40} color={WHITE_TEXT_COLOR} />
            </TouchableOpacity>
        )
    }

    renderFlipButton() {
        return (
            <TouchableOpacity style={styles.cameraButton} onPress={this.flipCamera}>
                <Icon name="ios-reverse-camera" size={40} color={WHITE_TEXT_COLOR} />
            </TouchableOpacity>
        )
    }

    render() {
        if (this.errorMessage)
            return (
                <SafeAreaView>
                    <Text>{this.errorMessage}</Text>
                    {this.renderCancelButton()}
                </SafeAreaView>
            )

        if (!this.permitted) return null
        return (
            <Camera
                // pictureSize = {'352x288'}
                style={styles.container}
                type={this.type}
                ref={this.setCameraRef}
            >
                <View style={styles.overlay}>
                    <View style={styles.controls}>
                        {this.renderCancelButton()}
                        {this.renderSnapshotButton()}
                        {this.renderFlipButton()}
                    </View>
                </View>
            </Camera>
        )
    }

    flipCamera = () => {
        this.setType(
            this.type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back
        )
    }

    setCameraRef = (ref) => {
        this.camera = ref
    }

    @action takePicture = () => {
        if (this.pending) return
        this.pending = true

        const { photoHandler } = this.props
        // TODO Make preview. Wait photo to load on device then go back. Expo camera freezes...
        // this.camera.getAvailablePictureSizesAsync().then(console.log)

        this.camera.takePictureAsync({ onPictureSaved: photoHandler })
        this.camera.pausePreview()
        // console.log('got photo')
        // photoHandler(photo)
        // console.log('handler')

        setTimeout(this.goBack, 2000)
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
