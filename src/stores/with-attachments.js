import {observable, action} from 'mobx'
import {ATTACHMENTS_STORE} from '../constants'
import {StatusBar} from 'react-native'
import * as ImagePicker from 'expo-image-picker'

const withAttachments = (extractor) => (Store) =>
  class WithAttachments extends Store {

    constructor(...args) {
      super(...args)

      if (!extractor) {
        this.attachments = observable([])
      }

    }

    @action _getContext = (params) => {
      if (!extractor || !params) {
        return this
      }
      return extractor(this, params)
    }

    @action _addAttachment = (context, uid) => {
      if (!context.attachments) context.attachments = []
      context.attachments.push(uid)
    }

    _attachHandler = async (params, picker) => {
      StatusBar.setBarStyle('default', true)

      try {
        const photo = await picker()
        this._attachFile(this._getContext(params), photo)
      } catch (e) {
        console.warn(e)
      }

      StatusBar.setBarStyle('light-content', true)
    }

    @action _attachFile = async (context, {uri, cancelled}) => {
      if (cancelled) return

      const store = this.getStore(ATTACHMENTS_STORE)

      const attachFile = store.attachFileSequence({uri})
      const {value: uid} = await attachFile.next()

      this._addAttachment(context, uid)

      attachFile.next()
    }

    getTempAttachments = (params) => {
      const store = this.getStore(ATTACHMENTS_STORE)

      return (this._getContext(params).attachments || [])
        .map(store.getAttachment)
    }

    attachmentsToDb = (params) => {
      const store = this.getStore(ATTACHMENTS_STORE)

      return (this._getContext(params).attachments || [])
        .reduce((acc, uid) => ({...acc, [uid]: store.getAttachment(uid).url}), {})
    }

    @action clearAttachments = (params) => this._getContext(params).attachments = []

    @action deleteAttachments = (params) => {
      const store = this.getStore(ATTACHMENTS_STORE)

      if (!this._getContext(params).attachments) return
      this._getContext(params).attachments.forEach(store.deleteAttachment)
      this.clearAttachments(params)
    }

    attachImageHandler = (params) => this._attachHandler(params, ImagePicker.launchImageLibraryAsync)
    attachPhotoHandler = (params) => this._attachHandler(params, ImagePicker.launchCameraAsync)

  }

export default withAttachments
