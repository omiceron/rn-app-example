import React, {Component} from 'react'
import {View, StyleSheet, TextInput, SafeAreaView} from 'react-native'
import {bool, string, func, shape, objectOf, number} from 'prop-types'
import TableView from '../common/table-view'
import TableRow from '../common/table-row'
import withAnimation from '../common/with-animation'
import {KEYBOARD, FEED_STORE} from '../../constants/'
import {observer, inject} from 'mobx-react'
import Icon from 'react-native-vector-icons/Ionicons'
import {NAVIGATION_STORE} from '../../constants/index'
import AttachedMap from './attached-map'


// navigation

@inject(NAVIGATION_STORE)
@inject(FEED_STORE)
@observer
class PostForm extends Component {
  static propTypes = {
    layouts: objectOf(objectOf(number)).isRequired,
    feed: shape({
      coords: shape({
        latitude: number.isRequired,
        longitude: number.isRequired
      }),
      attachedCoords: shape({
        latitude: number.isRequired,
        longitude: number.isRequired
      }),
      title: string.isRequired,
      text: string.isRequired,
      setTitle: func.isRequired,
      setText: func.isRequired,
      clearPostForm: func.isRequired
    }).isRequired,
  }

  componentWillUnmount() {
    this.props.feed.clearPostForm()
  }

  renderIcon = () => <Icon color = '#67E' size = {16} name = 'ios-pin'/>

  render() {
    const {text, title, setText, setTitle, attachedCoords} = this.props.feed
    const {height} = this.props.layouts[KEYBOARD]
    return <SafeAreaView style = {styles.container}>
      <TableView style = {styles.container}>

        <TableRow>
          <TextInput autoFocus
                     style = {styles.text}
                     placeholder = 'Enter title here...'
                     returnKeyType = 'next'
                     value = {title}
                     onChangeText = {setTitle}
                     onSubmitEditing = {() => this.textInput.focus()}/>
        </TableRow>

        <TableRow style = {styles.textRow}>
          <TextInput value = {text}
                     onChangeText = {setText}
                     ref = {ref => this.textInput = ref}
                     style = {styles.text}
                     placeholder = 'Enter text here...'
                     multiline/>
        </TableRow>

        <TableRow
          RightComponent = {attachedCoords ? null : this.renderIcon}
          onPress = {() => this.props.navigation.navigate('locationForm')}
          disableSeparator
        >
          {attachedCoords &&
          <AttachedMap onPress = {() => this.props.navigation.navigate('locationForm')}
                       coords = {attachedCoords}/>
          }
        </TableRow>

        <View style = {{height}}/>

      </TableView>
    </SafeAreaView>

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  textRow: {
    flex: 1,
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 16,
    fontWeight: '100'
  }
})

export default withAnimation(PostForm, {
  layoutNames: [KEYBOARD]
})