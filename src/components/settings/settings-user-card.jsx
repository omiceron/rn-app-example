import {inject, observer} from 'mobx-react'
import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {BLACK_TEXT_COLOR, CURRENT_USER_STORE, WARNING_COLOR} from '../../constants'
import FormInputs from '../ui/form/form-inputs'
import SegmentedCard from '../ui/segmented-card'
import {translate} from '../utils'
import SettingsAvatar from './settings-avatar'

const SettingsUserCard = (props) => {
    const {currentUser, addInputRef, focusNextInput} = props

    const formInputs = [
        {
            name: 'first-name',
            defaultValue: currentUser.firstName,
            onBlur: currentUser.updateUserData,
            onChangeText: currentUser.setFirstName,
            placeholder: translate('settings.user-card.first-name'),
            textContentType: 'givenName'
        },
        {
            name: 'last-name',
            defaultValue: currentUser.lastName,
            onBlur: currentUser.updateUserData,
            onChangeText: currentUser.setLastName,
            placeholder: translate('settings.user-card.last-name'),
            textContentType: 'familyName'
        }
    ]

    return (
        <SegmentedCard style={styles.userCardStyle} LeftComponent={SettingsAvatar}>
            <FormInputs
                data={formInputs}
                autoFocusIndex={0}
                addInputRef={addInputRef}
                focusNextInput={focusNextInput}
            />
        </SegmentedCard>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        fontWeight: '300',
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

export default inject(CURRENT_USER_STORE)(SettingsUserCard)
