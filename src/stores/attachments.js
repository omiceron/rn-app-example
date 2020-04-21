import EntitiesStore from './entities-store'
import { computed, action } from 'mobx'
import firebase from 'firebase/app'
import {
    AVATARS_STORAGE_REFERENCE,
    PEOPLE_REFERENCE,
    CURRENT_USER_STORE,
    CACHE_DIR,
    MESSENGER_STORE,
    ATTACHMENTS_STORAGE_REFERENCE
} from '../constants'
import path from 'path'
import * as FileSystem from 'expo-file-system'
import { alphabetic, copyFile, urlToBlob } from './utils'
import { toJS } from 'mobx'

class AttachmentsStore extends EntitiesStore {
    off() {
        this.clear()
    }

    getAttachment = (uid) => {
        return this.entities[uid]
    }

    getAttachmentLazily = async (url) => {
        const ref = firebase.storage().refFromURL(url)
        const { name: uid } = path.parse(ref.fullPath)

        if (!this.entities[uid]) await this.refreshAttachment(url)
        return this.entities[uid]
    }

    @action appendAttachment = async (attachment) => {
        if (!this.entities[attachment.uid]) {
            this.entities[attachment.uid] = {}
        }

        this.entities[attachment.uid] = { ...this.entities[attachment.uid], ...attachment }
        // await this.cacheEntities()
        return this.entities[attachment.uid]
    }

    deleteAttachment = (uid) => {
        const { url, uri, loaded, task } = this.entities[uid]

        // TODO: not sure. Maybe EE, UploadTaskSnapshot?
        if (!loaded) {
            this.entities[uid].aborted = true
            // task && task.cancel()
            return
        }

        const ref = firebase.storage().refFromURL(url)
        ref.delete().then(() => console.log('Deleted from server'))

        FileSystem.deleteAsync(uri).then(() => console.log('Deleted from device'))

        delete this.entities[uid]
    }

    async *attachFileSequence({ uri }) {
        const { name: uid, base } = path.parse(uri)
        const attachmentsDirectory = path.join(CACHE_DIR, ATTACHMENTS_STORAGE_REFERENCE)
        const attachmentUri = path.join(attachmentsDirectory, base)

        const attachment = {
            // uri,
            uid,
            key: uid,
            loading: true
        }

        await this.appendAttachment(attachment)

        yield uid

        await copyFile(uri, attachmentUri).catch(console.warn)

        attachment.uri = attachmentUri
        await this.appendAttachment(attachment)

        const ref = firebase.storage().ref(ATTACHMENTS_STORAGE_REFERENCE).child(base)

        const file = await urlToBlob(attachmentUri).catch(console.warn)

        await ref.put(file).catch(console.warn)

        // const task = ref.put(file)

        // task.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
        //   const progress = snapshot.bytesTransferred / snapshot.totalBytes * 100
        //   console.log('Upload is ' + progress + '% done')
        // })

        // this.entities[uid].task = task

        // await task.catch(console.warn)

        const url = await ref.getDownloadURL().catch(console.warn)

        attachment.url = url
        attachment.loading = false
        attachment.loaded = true

        await this.appendAttachment(attachment)

        if (this.entities[uid].aborted) {
            this.deleteAttachment(uid)
            return
        }

        return uid
    }

    @action refreshAttachment = async (url) => {
        const ref = firebase.storage().refFromURL(url)
        const { name: uid, base } = path.parse(ref.fullPath)

        await this.appendAttachment({
            uid,
            url,
            key: uid,
            loading: true,
            loaded: false
        })

        const attachmentsDirectory = path.join(CACHE_DIR, ATTACHMENTS_STORAGE_REFERENCE)
        const uri = path.join(attachmentsDirectory, base)

        const { exists } = await FileSystem.getInfoAsync(uri).catch(console.warn)

        if (!exists) {
            const { isDirectory } = await FileSystem.getInfoAsync(attachmentsDirectory).catch(console.warn)

            if (!isDirectory)
                await FileSystem.makeDirectoryAsync(attachmentsDirectory, { intermediates: true }).catch(console.warn)

            const { status } = await FileSystem.downloadAsync(url, uri).catch(console.warn)

            if (status !== 200) {
                FileSystem.deleteAsync(uri).then(() => console.log('Deleted from device'))

                delete this.entities[uid]
                return {}
            }
        }

        await this.appendAttachment({
            uid,
            url,
            uri,
            key: uid,
            loading: false,
            loaded: true
        })

        return this.entities[uid]
    }

    @action convertAttachments = async (payload) => {
        const attachmentsPromises = Object.values(payload).map(this.getAttachmentLazily)
        const attachments = await Promise.all(attachmentsPromises)

        return attachments

        // const attachments = await Object.values(payload).reduce(async (accP, url) => {
        //   const acc = await accP
        //   const attachment = await this.getAttachmentLazily(url)
        //   if (!attachment) return acc
        //   return {...acc, [attachment.uid]: attachment}
        // }, Promise.resolve({}))

        // return attachments
    }
}

export default AttachmentsStore
