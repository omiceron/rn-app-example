import React, {Component} from 'react'
import {TextInput, StyleSheet, ScrollView} from 'react-native'
import {observer, inject} from 'mobx-react'
import Separator from '../common/separator'
import CurrentUserAvatar from './current-user-avatar'
import TableSeparator from '../common/table-separator'
import TableRow from '../common/table-row'
import SegmentedCard from '../common/segmented-card'
import TableView from '../common/table-view'
import {AUTH_STORE, AVATAR_STORE, DEFAULT_BACKGROUND_COLOR, NAVIGATION_STORE, USER_STORE} from '../../constants'
import {string, func, shape, bool} from 'prop-types'

// avatar photo

@inject(NAVIGATION_STORE)
@inject(AUTH_STORE)
@inject(USER_STORE)
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
    user: shape({
      firstName: string.isRequired,
      lastName: string.isRequired,
      userInfo: string.isRequired,
      setLastName: func.isRequired,
      setFirstName: func.isRequired,
      setUserInfo: func.isRequired,
      updateUserData: func.isRequired
    }),
    avatar: shape({
      avatar: string.isRequired,
      loading: bool.isRequired,
    }),
  }

  // async componentWillMount() {
    // await this.props.auth.checkUserAvatar()
    // await Expo.FileSystem.deleteAsync(localAvatar)
    // console.log(await AsyncStorage.getItem(`user`).then(res => JSON.parse(res)))
  // }

  render() {
    const {navigate} = this.props.navigation
    const {avatar, loading} = this.props.avatar
    const {signOut} = this.props.auth
    const {
      firstName,
      lastName,
      userInfo,
      setLastName,
      setFirstName,
      setUserInfo,
      updateUserData
    } = this.props.user

    const LeftComponent = () =>
      <CurrentUserAvatar
        size = {80}
        onPress = {() => navigate('userPhoto')}
        uri = {avatar}
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
            defaultValue = {firstName}
            onChangeText = {setFirstName}
            onSubmitEditing = {() => this.lastNameRef.focus()}
            onBlur = {updateUserData}
          />

          <Separator leftIndent = {0}/>

          <TextInput
            ref = {ref => this.lastNameRef = ref}
            style = {styles.text}
            placeholder = 'Last Name'
            textContentType = 'familyName'
            returnKeyType = 'next'
            defaultValue = {lastName}
            onChangeText = {setLastName}
            onSubmitEditing = {() => this.infoRef.focus()}
            onBlur = {updateUserData}
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
            defaultValue = {userInfo}
            onChangeText = {setUserInfo}
            onBlur = {updateUserData}
          />
        </TableRow>
      </TableView>

      <TableSeparator hint = 'Enter your additional information here, like your bio, age or something like that'/>

      <TableView>
        <TableRow title = 'Dark Theme' onValueChange = {() => alert('Not ready yet!')}/>
        <TableRow title = 'Notifications' onPress = {() => alert('Not ready yet!')}/>
      </TableView>

      <TableSeparator/>

      <TableView>
        <TableRow title = 'Sign Out'
                  titleStyle = {styles.redButton}
                  onPress = {signOut}/>
      </TableView>

      <TableSeparator hint = 'Press button to log out'/>

    </ScrollView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DEFAULT_BACKGROUND_COLOR
  },
  text: {
    fontSize: 16,
    fontWeight: '100'
  },
  textView: {
    flex: 1,
    justifyContent: 'space-around',
    marginLeft: 10
  },
  redButton: {
    color: '#E67',
    textAlign: 'center'
  }
})

export default Settings