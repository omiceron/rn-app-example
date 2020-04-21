// @flow

import * as React from 'react'
import { observable, action, computed } from 'mobx'
import { inject, observer } from 'mobx-react'
import { StatusBar } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { ATTACHMENTS_STORE } from '../../constants'

export default (...props) => (
  Component: React.ComponentType<any>
  // TODO: not the best practice but ok

  // TODO: send this to store with callback
  // Component.prototype.__proto__
) =>
  @inject(ATTACHMENTS_STORE)
  @observer
  class WithAttachments extends React.Component<*> {
    componentWillUnmount() {
      this._attachments.forEach(this.props.attachments.deleteAttachment)
    }

    @observable _attachments = []
    @action addAttachment = (uid) => (this._attachments = [...this._attachments, uid])
    @action clearAttachments = () => (this._attachments = [])

    @computed
    get attachmentsList() {
      return this._attachments.map(this.props.attachments.getAttachment)
    }

    @computed get attachmentsObject() {
      return this._attachments.reduce((acc, uid) => {
        const { url } = this.props.attachments.getAttachment(uid)
        return { ...acc, [uid]: url }
      }, {})
    }

    attachFile = async ({ uri, cancelled }) => {
      if (cancelled) return

      const attachFile = this.props.attachments.attachFileSequence({ uri })
      const { value: uid } = await attachFile.next()

      this.addAttachment(uid)

      attachFile.next()
    }

    attachImageHandler = async () => {
      StatusBar.setBarStyle('default', true)

      const photo = await ImagePicker.launchImageLibraryAsync().catch(console.warn)

      this.attachFile(photo)

      StatusBar.setBarStyle('light-content', true)
    }

    attachPhotoHandler = async () => {
      StatusBar.setBarStyle('default', true)

      try {
        const photo = await ImagePicker.launchCameraAsync()
        this.attachFile(photo)
      } catch (e) {
        console.warn(e)
      }

      StatusBar.setBarStyle('light-content', true)
    }

    render() {
      return (
        <Component
          {...this.props}
          attachPhotoHandler={this.attachPhotoHandler}
          attachImageHandler={this.attachImageHandler}
          attachmentsList={this.attachmentsList}
          attachmentsObject={this.attachmentsObject}
          clearAttachments={this.clearAttachments}
        />
      )
    }
  }
