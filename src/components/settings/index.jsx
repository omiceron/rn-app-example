import React, {Component} from 'react'
import {TextInput, StyleSheet, ScrollView, ActionSheetIOS, StatusBar} from 'react-native'
import {observer, inject} from 'mobx-react'
import CurrentUserAvatar from './current-user-avatar'
import TableRow from '../common/table/table-row'
import SegmentedCard from '../common/segmented-card'
import {
    AUTH_STORE,
    AVATAR_STORE,
    NAVIGATION_STORE,
    BLACK_TEXT_COLOR,
    CURRENT_USER_STORE,
    WARNING_COLOR
} from '../../constants'
import {string, func, shape, bool} from 'prop-types'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import List from '../common/list/list'
import FormInputs from '../common/form/form-inputs'

@inject(NAVIGATION_STORE)
@inject(AUTH_STORE)
@inject(CURRENT_USER_STORE)
@inject(AVATAR_STORE)
@observer
class Settings extends Component {
    static propTypes = {
        navigation: shape({
            navigate: func.isRequired
        }),
        auth: shape({
            signOut: func.isRequired
        }),
        [CURRENT_USER_STORE]: shape({
            firstName: string.isRequired,
            lastName: string,
            userInfo: string,
            setLastName: func.isRequired,
            setFirstName: func.isRequired,
            setUserInfo: func.isRequired,
            updateUserData: func.isRequired
        }),
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
                if (buttonIndex === 1) {
                    await Permissions.askAsync(Permissions.CAMERA_ROLL)
                    StatusBar.setHidden(true, 'slide')

                    const photo = await ImagePicker.launchImageLibraryAsync().catch(console.warn)

                    StatusBar.setHidden(false, 'slide')

                    this.props.avatar.takePhoto(photo, true).catch(console.warn)
                }
                if (buttonIndex === 2) {
                    await Permissions.askAsync(Permissions.CAMERA)
                    StatusBar.setHidden(true, 'slide')

                    const photo = await ImagePicker.launchCameraAsync().catch(console.warn)

                    StatusBar.setHidden(false, 'slide')

                    this.props.avatar.takePhoto(photo).catch(console.warn)
                }
                if (buttonIndex === 3) {
                    alert('removed!')
                }
            }
        )
    }

    handleSignOut = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                title: 'Are you sure you want to sign out?',
                options: ['Cancel', 'Sign out'],
                destructiveButtonIndex: 1,
                cancelButtonIndex: 0
            },
            (buttonIndex) => {
                if (buttonIndex === 1) {
                    this.props.auth.signOut()
                }
            }
        )

    renderAvatar = () => {
        const {uri, loading} = this.props.avatar

        return (
            <CurrentUserAvatar
                size={80}
                onPress={() => !loading && this.getPhoto()}
                // onPress = {() => !loading && navigate('userPhoto')}
                uri={uri}
                loading={loading}
            />
        )
    }

    renderUserCard = ({addInputRef, focusNextInput}) => {
        const {currentUser} = this.props

        const formInputs = [
            {
                name: 'first-name',
                defaultValue: currentUser.firstName,
                onBlur: currentUser.updateUserData,
                onChangeText: currentUser.setFirstName,
                placeholder: 'First Name',
                textContentType: 'givenName'
            },
            {
                name: 'last-name',
                defaultValue: currentUser.lastName,
                onBlur: currentUser.updateUserData,
                onChangeText: currentUser.setLastName,
                placeholder: 'Last Name',
                textContentType: 'familyName'
            }
        ]

        return (
            <SegmentedCard style={styles.userCardStyle} LeftComponent={this.renderAvatar}>
                <FormInputs
                    data={formInputs}
                    autoFocusIndex={0}
                    addInputRef={addInputRef}
                    focusNextInput={focusNextInput}
                />
            </SegmentedCard>
        )
    }

    renderBio = ({addInputRef}) => {
        const {currentUser} = this.props

        return (
            <TableRow>
                <TextInput
                    ref={addInputRef}
                    name="user-bio"
                    style={styles.text}
                    placeholder="Info"
                    returnKeyType="done"
                    defaultValue={currentUser.userInfo}
                    onChangeText={currentUser.setUserInfo}
                    onBlur={currentUser.updateUserData}
                />
            </TableRow>
        )
    }

    render() {
        const sections = [
            {
                hint: 'Enter your name and add photo here',
                data: [
                    {
                        customComponent: this.renderUserCard,
                        name: 'user-card'
                    }
                ]
            },
            {
                hint: 'Enter your additional information here, like your bio, age or something like that',
                data: [
                    {
                        customComponent: this.renderBio,
                        name: 'user-bio'
                    }
                ]
            },
            {
                data: [
                    {
                        name: 'dark-theme-toggle',
                        title: 'Dark Theme',
                        onValueChange: () => alert('Not ready yet!')
                    },
                    {
                        name: 'notifications-button',
                        title: 'Notifications',
                        onPress: () => alert('Not ready yet!')
                    }
                ]
            },
            {
                hint: 'Press button to log out',
                data: [
                    {
                        name: 'sign-out-button',
                        title: 'Sign out',
                        titleStyle: styles.redButton,
                        onPress: this.handleSignOut
                    }
                ]
            }
        ]

        return <List sections={sections} />
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: '100',
        color: BLACK_TEXT_COLOR
    },
    userCardStyle: {
        flex: 1,
        padding: 0,
        paddingLeft: 10
    },
    redButton: {
        color: WARNING_COLOR,
        textAlign: 'center'
    }
})

export default Settings
