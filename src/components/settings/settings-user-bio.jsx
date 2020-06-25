import {inject} from 'mobx-react'
import React from 'react'
import {StyleSheet, TextInput} from 'react-native'
import {BLACK_TEXT_COLOR, CURRENT_USER_STORE} from '../../constants'
import TableRow from '../ui/table/table-row'
import {translate} from '../utils'

const SettingsUserBio = ({currentUser, addInputRef}) => (
    <TableRow>
        <TextInput
            ref={addInputRef}
            name="user-bio"
            style={styles.content}
            placeholder={translate('settings.user-bio.placeholder')}
            returnKeyType="done"
            defaultValue={currentUser.userInfo}
            onChangeText={currentUser.setUserInfo}
            onBlur={currentUser.updateUserData}
        />
    </TableRow>
)

const styles = StyleSheet.create({
    content: {
        fontSize: 16,
        fontWeight: '300',
        color: BLACK_TEXT_COLOR
    }
})

export default inject(CURRENT_USER_STORE)(SettingsUserBio)
