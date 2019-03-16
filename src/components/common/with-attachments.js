// @flow

import * as React from 'react'
import {observable, action, computed} from 'mobx'
import {inject, observer} from 'mobx-react'
import {StatusBar} from 'react-native'
import {ImagePicker} from 'expo'
import {ATTACHMENTS_STORE} from '../../constants'

@inject(ATTACHMENTS_STORE)
@observer
export default (...props) => (Component: React.ComponentType<any>) =>
  class WithAttachments extends React.Component<*> {

    componentWillUnmount() {
      // TODO: not the best practice but ok
      // this.attachments.forEach(this.props.attachments.deleteAttachment)
    }

    @observable attachments = []
    @action addAttachment = (uid) => this.attachments = [...this.attachments, uid]
    @action clearAttachments = () => this.attachments = []

    @computed
    get attachmentsList() {
      return this.attachments.map(this.props.attachments.getAttachment)
    }

    // TODO: send this to store with callback
    attachFile = async ({uri, cancelled}) => {
      if (cancelled) return

      const attachFile = this.props.attachments.attachFileSequence({uri})
      const {value: uid} = await attachFile.next()

      this.addAttachment(uid)

      attachFile.next()
    }

    attachImageHandler = async () => {
      StatusBar.setBarStyle('default', true)

      const photo = await ImagePicker.launchImageLibraryAsync()
        .catch(console.warn)

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
      // Component.prototype.__proto__

      return <Component
        {...this.props}
        attachPhotoHandler = {this.attachPhotoHandler}
        attachImageHandler = {this.attachImageHandler}
        attachmentsList = {this.attachmentsList}
        clearAttachments = {this.clearAttachments}
      />
    }
  }