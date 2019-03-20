import React, {Component} from 'react'
import {reaction} from 'mobx'
import {observer, inject} from 'mobx-react'
import {View, StyleSheet, TextInput, SafeAreaView, LayoutAnimation} from 'react-native'
import {isIphoneX, getBottomSpace} from 'react-native-iphone-x-helper'
import {bool, string, func, shape, objectOf, number} from 'prop-types'

import {KEYBOARD, FEED_STORE, BLACK_TEXT_COLOR, WHITE_BACKGROUND_COLOR, NAVIGATION_STORE} from '../../constants/'

import withAnimation from '../common/with-animation'
import withAttachments from '../common/with-attachments'

import TableView from '../common/table-view'
import TableRow from '../common/table-row'
import AttachmentsList from '../common/attachments-list'
import AttachedLocation from './attached-location'
import PostFormControlRow from './post-form-control-row'

@withAttachments()
@withAnimation(KEYBOARD)
@inject(NAVIGATION_STORE)
@inject(FEED_STORE)
@observer
class PostForm extends Component {

  constructor(...args) {
    super(...args)

    this.props.setClearAttachments(this.props.clearAttachments)

    reaction(
      () => this.props.layouts[KEYBOARD],
      () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    )

    reaction(
      () => this.props.attachmentsList,
      () => this.props.getAttachmentsHelper(this.props.attachmentsObject)
    )
  }

  static propTypes = {
    // layouts: objectOf(objectOf(number)).isRequired,
    getAttachmentsHelper: func.isRequired,
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
    })
  }

  componentWillUnmount() {
    this.props.feed.clearPostForm()
    console.log(this.props.attachmentsList)
  }

  setTextInputRef = ref => this.textInput = ref

  render() {
    const {feed} = this.props
    const {height} = this.props.layouts[KEYBOARD]

    return <SafeAreaView style = {styles.container}>
      <TableView style = {styles.container}>

        <TableRow>
          <TextInput
            autoFocus
            style = {styles.text}
            placeholder = 'Enter title here...'
            returnKeyType = 'next'
            value = {feed.title}
            onChangeText = {feed.setTitle}
            onSubmitEditing = {() => this.textInput.focus()}
          />
        </TableRow>

        <TableRow style = {styles.textRow}>
          <TextInput
            value = {feed.text}
            onChangeText = {feed.setText}
            ref = {this.setTextInputRef}
            style = {styles.text}
            placeholder = 'Enter text here...'
            multiline
          />
        </TableRow>

        {this.props.attachmentsList.length ? <AttachmentsList attachments = {this.props.attachmentsList}/> : null}

        {feed.attachedLocation ? <TableRow>
          <AttachedLocation disableIcon location = {feed.attachedLocation}/>
        </TableRow> : null}

        <PostFormControlRow
          attachImageHandler = {this.props.attachImageHandler}
          attachPhotoHandler = {this.props.attachPhotoHandler}
        />

        <View style = {{height: height - (isIphoneX() && getBottomSpace())}}/>

      </TableView>
    </SafeAreaView>

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WHITE_BACKGROUND_COLOR
  },
  textRow: {
    flex: 1,
    alignItems: 'flex-start'
  },
  text: {
    fontSize: 16,
    fontWeight: '100',
    color: BLACK_TEXT_COLOR
  }
})

export default PostForm