import React, {Component} from 'react'
import {TextInput, StyleSheet, ScrollView, ActionSheetIOS, StatusBar} from 'react-native'
import {observer, inject} from 'mobx-react'
import Separator from '../common/separator'
import CurrentUserAvatar from './current-user-avatar'
import TableSeparator from '../common/table-separator'
import TableRow from '../common/table-row'
import SegmentedCard from '../common/segmented-card'
import TableView from '../common/table-view'
import {
  AUTH_STORE, AVATAR_STORE, INACTIVE_BACKGROUND_COLOR, NAVIGATION_STORE, BLACK_TEXT_COLOR, CURRENT_USER_STORE,
  WARNING_COLOR
} from '../../constants'
import {string, func, shape, bool} from 'prop-types'
import {ImagePicker} from 'expo'

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

  render() {
    const {navigate} = this.props.navigation
    const {uri, loading} = this.props.avatar
    const {currentUser} = this.props

    const LeftComponent = () =>
      <CurrentUserAvatar
        size = {80}
        onPress = {() => !loading && this.getPhoto()}
        // onPress = {() => !loading && navigate('userPhoto')}
        uri = {uri}
        loading = {loading}
      />

    return <ScrollView style = {styles.container}>
      <TableView>
        <SegmentedCard
          mainContainerStyle = {styles.textView}
          LeftComponent = {LeftComponent}>
          <TextInput
            style = {styles.text}
            placeholder = 'First Name'
            textContentType = 'givenName'
            returnKeyType = 'next'
            defaultValue = {currentUser.firstName}
            onChangeText = {currentUser.setFirstName}
            onSubmitEditing = {() => this.lastNameRef.focus()}
            onBlur = {currentUser.updateUserData}
          />

          <Separator leftIndent = {0}/>

          <TextInput
            ref = {ref => this.lastNameRef = ref}
            style = {styles.text}
            placeholder = 'Last Name'
            textContentType = 'familyName'
            returnKeyType = 'next'
            defaultValue = {currentUser.lastName}
            onChangeText = {currentUser.setLastName}
            onSubmitEditing = {() => this.infoRef.focus()}
            onBlur = {currentUser.updateUserData}
          />
        </SegmentedCard>
      </TableView>

      <TableSeparator hint = 'Enter your name and add photo here'/>

      {/*      <View style = {styles.simpleRow}>
        <TextInput
          ref = {ref => this.infoRef = ref}
          style = {styles.text}
          placeholder = 'Info'
          returnKeyType = 'done'
          defaultValue = {userInfo}
          onChangeText = {setUserInfo}
          // onSubmitEditing = {updateUserData}
          onBlur = {updateUserData}/>
      </View>*/}

      <TableView>
        <TableRow>
          <TextInput
            ref = {ref => this.infoRef = ref}
            style = {styles.text}
            placeholder = 'Info'
            returnKeyType = 'done'
            defaultValue = {currentUser.userInfo}
            onChangeText = {currentUser.setUserInfo}
            onBlur = {currentUser.updateUserData}
          />
        </TableRow>
      </TableView>

      <TableSeparator hint = 'Enter your additional information here, like your bio, age or something like that'/>

      {/*<TableView>
        <TableRow title = 'Dark Theme' onValueChange = {() => alert('Not ready yet!')}/>
        <TableRow title = 'Notifications' onPress = {() => alert('Not ready yet!')}/>
      </TableView>

      <TableSeparator/>*/}

      <TableView>
        <TableRow title = 'Sign out'
                  titleStyle = {styles.redButton}
                  onPress = {this.handleSignOut}/>
      </TableView>

      <TableSeparator hint = 'Press button to log out'/>

    </ScrollView>
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
          StatusBar.setHidden(true, 'slide')

          const photo = await ImagePicker.launchImageLibraryAsync()
            .catch(console.warn)

          StatusBar.setHidden(false, 'slide')

          this.props.avatar.takePhoto(photo, true)
            .catch(console.warn)

        }
        if (buttonIndex === 2) {
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
  container: {
    flex: 1,
    backgroundColor: INACTIVE_BACKGROUND_COLOR
  },
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