import {observable, action} from 'mobx'
import {ATTACHMENTS_STORE} from '../constants'
import {StatusBar} from 'react-native'
import {ImagePicker} from 'expo'

export default (extractor) => (Store) =>
  class WithAttachments extends Store {

    constructor(...args) {
      super(...args)

      if (!extractor) {
        this.attachments = observable({})
      }

    }

    @action _addAttachment = (uid, context) => {
      if (!context.attachments) context.attachments = {}
      context.attachments[uid] = uid
    }

    @action _attachFile = async ({uri, cancelled}, context) => {
      if (cancelled) return

      const attachFile = this.getStore(ATTACHMENTS_STORE).attachFileSequence({uri})
      const {value: uid} = await attachFile.next()

      this._addAttachment(uid, context)

      attachFile.next()
    }

    getAttachments = (params) => {
      return Object.values(this._getContext(params).attachments || {})
        .map(this.getStore(ATTACHMENTS_STORE).getAttachment)
    }

    getAttachmentsObject = (params) => {
      return this._getContext(params).attachments.reduce((acc, uid) => {
        const {url} = this.getStore(ATTACHMENTS_STORE).getAttachment(uid)
        return ({...acc, [uid]: url})
      }, {})
    }

    @action _getContext = (params) => {
      if (!extractor || !params) {
        return this
      }
      return extractor(this, params)
    }

    @action clearAttachments = (params) => this._getContext(params).attachments = {}

    @action deleteAttachments = (params) => {
      if (!this._getContext(params).attachments) return
      Object.keys(this._getContext(params).attachments).forEach(this.getStore(ATTACHMENTS_STORE).deleteAttachment)
    }

    // this.attachImageHandler({uid: this.props.chatId})
    attachImageHandler = async (params) => {
      StatusBar.setBarStyle('default', true)

      try {
        const photo = await ImagePicker.launchImageLibraryAsync()
        this._attachFile(photo, this._getContext(params))
      } catch (e) {
        console.warn(e)
      }

      StatusBar.setBarStyle('light-content', true)

    }

    attachPhotoHandler = async (params) => {
      StatusBar.setBarStyle('default', true)

      try {
        const photo = await ImagePicker.launchCameraAsync()
        this._attachFile(photo, this._getContext(params))
      } catch (e) {
        console.warn(e)
      }

      StatusBar.setBarStyle('light-content', true)

    }

  }
