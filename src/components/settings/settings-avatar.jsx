import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import {inject, observer} from 'mobx-react'
import React, {Component} from 'react'
import {ActionSheetIOS, ActivityIndicator, StatusBar} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import TouchableAvatar from '../ui/touchable-avatar'
import {bool, shape, string} from 'prop-types'
import {AVATAR_STORE, WHITE_TEXT_COLOR} from '../../constants'

@inject(AVATAR_STORE)
@observer
class SettingsAvatar extends Component {
    static propTypes = {
        avatar: shape({
            avatar: string,
            loading: bool.isRequired
        })
    }

    getPhoto = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Choose photo from gallery', 'Take snapshot', 'Delete photo'],
                destructiveButtonIndex: 3,
                cancelButtonIndex: 0
            },
            async (buttonIndex) => {
                const {avatar} = this.props

                if (buttonIndex === 1) {
                    await Permissions.askAsync(Permissions.CAMERA_ROLL)
                    StatusBar.setHidden(true, 'slide')

                    const photo = await ImagePicker.launchImageLibraryAsync().catch(console.warn)

                    StatusBar.setHidden(false, 'slide')

                    avatar.takePhoto(photo, true).catch(console.warn)
                }
                if (buttonIndex === 2) {
                    await Permissions.askAsync(Permissions.CAMERA)
                    StatusBar.setHidden(true, 'slide')

                    const photo = await ImagePicker.launchCameraAsync().catch(console.warn)

                    StatusBar.setHidden(false, 'slide')

                    avatar.takePhoto(photo).catch(console.warn)
                }
                if (buttonIndex === 3) {
                    alert('removed!')
                }
            }
        )
    }

    handlePress = () => {
        const {loading} = this.props.avatar

        return !loading && this.getPhoto()
    }

    render() {
        const {loading, uri} = this.props.avatar

        return (
            <TouchableAvatar uri={uri} size={80} onPress={this.handlePress}>
                {loading ? <ActivityIndicator /> : <Icon name="ios-camera" size={35} color={WHITE_TEXT_COLOR} />}
            </TouchableAvatar>
        )
    }
}

export default SettingsAvatar
