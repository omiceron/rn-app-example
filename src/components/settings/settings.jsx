import React, {Component} from 'react'
import {TextInput, StyleSheet, ScrollView, ActionSheetIOS, StatusBar} from 'react-native'
import {observer, inject} from 'mobx-react'
import {translate} from '../utils'
import {AUTH_STORE, BLACK_TEXT_COLOR, CURRENT_USER_STORE, WARNING_COLOR} from '../../constants'
import {string, func, shape, bool} from 'prop-types'
import BasicList from '../ui/basic-list/basic-list'
import SettingsUserBio from './settings-user-bio'
import SettingsUserCard from './settings-user-card'

@inject(AUTH_STORE)
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
        })
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

    render() {
        const sections = [
            {
                hint: translate('settings.user-card.hint'),
                data: [
                    {
                        customComponent: SettingsUserCard,
                        name: 'user-card'
                    }
                ]
            },
            {
                hint: translate('settings.user-bio.hint'),
                data: [
                    {
                        customComponent: SettingsUserBio,
                        name: 'user-bio'
                    }
                ]
            },
            {
                data: [
                    {
                        name: 'dark-theme-toggle',
                        title: translate('settings.theme.title'),
                        onValueChange: () => alert('Not ready yet!')
                    },
                    {
                        name: 'notifications-button',
                        title: translate('settings.notifications.title'),
                        onPress: () => alert('Not ready yet!')
                    }
                ]
            },
            {
                hint: translate('settings.sign-out.hint'),
                data: [
                    {
                        name: 'sign-out-button',
                        title: translate('settings.sign-out.title'),
                        titleStyle: styles.redButton,
                        onPress: this.handleSignOut
                    }
                ]
            }
        ]

        return <BasicList sections={sections} />
    }
}

const styles = StyleSheet.create({
    redButton: {
        color: WARNING_COLOR,
        textAlign: 'center'
    }
})

export default Settings
