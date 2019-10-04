import React, {Component} from 'react'
import { TextInput, StyleSheet, ScrollView, ActionSheetIOS, StatusBar, SectionList } from 'react-native'
import {observer, inject} from 'mobx-react'
import CurrentUserAvatar from './current-user-avatar'
import TableRow from '../common/table/table-row'
import SegmentedCard from '../common/segmented-card'
import TableBlock from '../common/table/table-block'
import {
  AUTH_STORE, AVATAR_STORE, INACTIVE_BACKGROUND_COLOR, NAVIGATION_STORE, BLACK_TEXT_COLOR, CURRENT_USER_STORE,
  WARNING_COLOR
} from '../../constants'
import {string, func, shape, bool} from 'prop-types'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import LinedSeparator from '../common/separator/lined-separator'
import Table from '../common/table/table'
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

  renderLeftComponent = () => {
    const { uri, loading } = this.props.avatar

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

  renderUserCard = ({focusOnInput, addInputRef, getTotalLength}) => {
    const {currentUser} = this.props

    const formInputs = [
      {
        defaultValue: currentUser.firstName,
        onBlur: currentUser.updateUserData,
        onChangeText: currentUser.setFirstName,
        placeholder: 'First Name',
        textContentType: 'givenName',
      },
      {
        defaultValue: currentUser.lastName,
        onBlur: currentUser.updateUserData,
        onChangeText: currentUser.setLastName,
        placeholder: 'Last Name',
        textContentType: 'familyName',
      }
    ]

    return (
      <SegmentedCard
        mainContainerStyle={styles.textView}
        LeftComponent={this.renderLeftComponent}>
        <FormInputs data={formInputs} addInputRef = {addInputRef} focusOnInput={focusOnInput} getTotalLength={getTotalLength}/>
      </SegmentedCard>
    )
  }

  renderBio = ({focusOnInput, addInputRef}) => {
    const {currentUser} = this.props

    return (
      <TableRow>
        <TextInput
          ref={addInputRef}
          name='bio'
          style={styles.text}
          placeholder='Info'
          returnKeyType='done'
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
        data: [{ customComponent: this.renderUserCard }]
      },
      {
        hint: 'Enter your additional information here, like your bio, age or something like that',
        data: [{ customComponent: this.renderBio }]
      },
      {
        data: [
          {
            title: 'Dark Theme',
            onValueChange: () => alert('Not ready yet!')
          },
          {
            title: 'Notifications',
            onPress: () => alert('Not ready yet!')
          }
        ]
      },
      {
        hint: 'Press button to log out',
        data: [
          {
            title: 'Sign out',
            titleStyle: styles.redButton,
            onPress: this.handleSignOut
          }
        ]
      }
    ]

    return (
      <List sections={sections}/>
    )
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

          const photo = await ImagePicker.launchImageLibraryAsync()
            .catch(console.warn)

          StatusBar.setHidden(false, 'slide')

          this.props.avatar.takePhoto(photo, true)
            .catch(console.warn)

        }
        if (buttonIndex === 2) {
          await Permissions.askAsync(Permissions.CAMERA)
          StatusBar.setHidden(true, 'slide')

          const photo = await ImagePicker.launchCameraAsync()
            .catch(console.warn)

          StatusBar.setHidden(false, 'slide')

          this.props.avatar.takePhoto(photo)
            .catch(console.warn)

        }
        if (buttonIndex === 3) {
          alert('removed!')
        }

      }
    )
  }

  setLastNameRef = ref => this.lastNameRef = ref
  setInfoRef = ref => this.infoRef = ref

  handleSignOut = () => ActionSheetIOS.showActionSheetWithOptions(
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

}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    fontWeight: '100',
    color: BLACK_TEXT_COLOR

  },
  textView: {
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 10
  },
  redButton: {
    color: WARNING_COLOR,
    textAlign: 'center'
  }
})

export default Settings
