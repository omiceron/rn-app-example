import React, {Component} from 'react'
import {reaction, computed} from 'mobx'
import {observer, inject} from 'mobx-react'
import {View, StyleSheet, TextInput, SafeAreaView, LayoutAnimation} from 'react-native'
import {isIphoneX, getBottomSpace} from 'react-native-iphone-x-helper'
import {bool, string, func, shape, objectOf, number, array} from 'prop-types'

import {KEYBOARD, FEED_STORE, BLACK_TEXT_COLOR, WHITE_BACKGROUND_COLOR, NAVIGATION_STORE} from '../../constants/'

import withAnimation from '../common/with-animation'

import TableBlock from '../common/table-block'
import TableRow from '../common/table-row'
import AttachmentsList from '../common/attachments-list'
import AttachedLocation from './attached-location'
import PostFormControlRow from './post-form-control-row'

@withAnimation(KEYBOARD)
@inject(NAVIGATION_STORE)
@inject(FEED_STORE)
@observer
class PostForm extends Component {
  static propTypes = {
    // layouts: objectOf(objectOf(number)).isRequired,
    // getAttachmentsHelper: func.isRequired,
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
      clearPostForm: func.isRequired,
      attachments: array
    }),
  }

  constructor(...args) {
    super(...args)

    reaction(
      () => this.props.layouts[KEYBOARD],
      () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    )

    this.stopReactionOnAttachments = reaction(
      () => this.tempAttachments.length,
      () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    )
  }

  componentWillUnmount() {
    this.stopReactionOnAttachments()
    this.props.feed.clearPostForm()
    this.props.feed.deleteAttachments()
  }

  @computed
  get tempAttachments() {
    return this.props.feed.getTempAttachments()
  }

  setTextInputRef = ref => this.textInput = ref

  render() {
    const {feed} = this.props
    const {height} = this.props.layouts[KEYBOARD]

    return <SafeAreaView style = {styles.container}>
      <TableBlock disableSeparator style = {styles.container}>

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

        {this.tempAttachments.length ? <AttachmentsList attachments = {this.tempAttachments}/> : null}

        {feed.attachedLocation ? <TableRow>
          <AttachedLocation disableIcon location = {feed.attachedLocation}/>
        </TableRow> : null}

        <PostFormControlRow
          disableSeparator
          attachImageHandler = {() => this.props.feed.attachImageHandler()}
          attachPhotoHandler = {() => this.props.feed.attachPhotoHandler()}
        />

        <View style = {{height: height - (isIphoneX() && getBottomSpace())}}/>

      </TableBlock>
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
