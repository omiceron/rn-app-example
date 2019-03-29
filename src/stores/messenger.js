// chat structure:
//
// [chatId]: {
//   messages: {
//     [messageId]: {
//       key: [messageId]
//       timestamp
//       text
//       userId ??? maybe better isCurrentUser
//     }
//   }
//   chatId: [chatId]
//   key: [refId]
//   user: obj
//   loaded: bool
//   loading: bool
// }

import {action, computed, observable} from 'mobx'
import firebase from 'firebase/app'
import EntitiesStore from './entities-store'
import {
  ATTACHMENTS_STORE,
  CHATS_CHUNK_LENGTH,
  CHATS_REFERENCE,
  MESSAGES_CHUNK_LENGTH,
  MESSAGES_REFERENCE,
  PEOPLE_REFERENCE,
  PEOPLE_STORE
} from '../constants'
import {toJS} from 'mobx'
import withAttachments from './with-attachments'

@withAttachments((store, uid) => store.entities[uid])
class MessengerStore extends EntitiesStore {

  getChatReference = (chatId) => {
    return firebase.database()
      .ref(CHATS_REFERENCE)
      .child(chatId)
      .child(MESSAGES_REFERENCE)
  }

  getUserChatsReference = (userId) => {
    return firebase.database()
      .ref(PEOPLE_REFERENCE)
      .child(userId)
      .child(CHATS_REFERENCE)
  }

  get currentUserChatsReference() {
    return this.getUserChatsReference(this.user.uid)
  }

  @computed
  get chats() {
    return this.list
      .filter(({lastMessage}) => lastMessage)
      .sort(({lastMessage: a}, {lastMessage: b}) => b.timestamp - a.timestamp)
  }

  isChatLoaded = (chatId) => {
    if (!this.entities[chatId]) {
      console.log('no chat', chatId)
      return
    }
    return this.entities[chatId].loaded
  }

  isChatLoading = (chatId) => {
    if (!this.entities[chatId]) return
    return this.entities[chatId].loading
  }

  // todo: inspect
  getMessages = (chatId) => {
    const chat = this.entities[chatId]
    if (!chat || !chat.messages) return []
    return Object.values(chat.messages).sort((a, b) => b.timestamp - a.timestamp)
  }

  getLastFetchedMessage = (chatId) => {
    const messages = this.getMessages(chatId)
    return messages[messages.length - 1]
  }

  // fixme: subscribe wrong behavior
  @computed
  get earliestFetchedChatTimestamp() {
    const chat = this.chats[this.chats.length - 1]

    if (!chat) return

    return chat.lastMessage.timestamp
  }

  @observable lastChatTimestamp = null

  @action setTimestamp = (payload) => {
    const timestamps = Object.values(payload).filter(x => x.lastMessage).map(x => x.lastMessage.timestamp)
    if (!timestamps.length) return
    const timestamp = Math.min(...timestamps)

    // if (timestamp < this.lastEntityKey || !this.lastEntityKey) {
    //   this.lastEntityKey = timestamp
    // }

    if (timestamp < this.lastChatTimestamp || !this.lastChatTimestamp) {
      this.lastChatTimestamp = timestamp
    }
  }

  @action subscribeOnChats = () => {
    console.log('SUBSCRIBE ON CHATS:', 'start')

    const callback = async (snapshot) => {
      const payload = snapshot.val()

      if (!payload) return

      // TODO: loading?
      console.log('SUBSCRIBE ON CHATS:', 'get data')

      const chat = await this.convertChat(payload)
      await this.appendChat(chat)

      this.setTimestamp(payload)
    }

    this.currentUserChatsReference
      .orderByChild('lastMessage/timestamp')
      .limitToLast(1)
      .on('value', callback)

  }

  cacheMessenger = async () => {
    const chats = this.chats
      .slice(0, CHATS_CHUNK_LENGTH)
      .reduce((acc, {subscribed, loaded, loading, ...chat}) => {
        // if (chat.messages) {
        //   chat.messages = this.getMessages(chat.chatId)
        //     .slice(0, MESSAGES_CHUNK_LENGTH)
        //     .reduce((acc, message) => ({...acc, [message.key]: message}), {})
        // }

        return ({...acc, [chat.chatId]: toJS(chat)})
      }, {})
    console.log('cacheMessenger')
    return await this.cache(chats)
  }

  // @action getTimestamp = (payload) => {
  //   const timestamps = Object.values(payload).filter(x => x.lastMessage).map(x => x.lastMessage.timestamp)
  //   if (!timestamps.length) return
  //   const timestamp = Math.min(...timestamps)
  //
  //   if (timestamp < this.lastEntityKey || !this.lastEntityKey) {
  //     return timestamp
  //   }
  //
  //   return this.lastEntityKey
  // }

  // fetchChats = () => {
  //   return this.fetchEntities(
  //     () => this.currentUserChatsReference.orderByChild('lastMessage/timestamp'),
  //     this.appendFetchedChats,
  //     CHATS_CHUNK_LENGTH,
  //     this,
  //     ([key, chat]) => chat.lastMessage,
  //     this.getTimestamp)
  // }

  @action fetchChats = async () => {
    if (this.loaded || this.loading || !this.user) return

    console.log('FETCH CHATS:', 'start')
    this.loading = true

    const chunkShift = this.lastChatTimestamp ? 1 : 0
    // const chunkShift = this.earliestFetchedChatTimestamp ? 1 : 0
    const chunkLength = CHATS_CHUNK_LENGTH + chunkShift

    const callback = action(async (snapshot) => {
      const payload = snapshot.val() || {}

      const currentChunkLength = Object.values(payload).filter(x => x.lastMessage).length
      const isEmpty = currentChunkLength === chunkShift

      this.setTimestamp(payload)

      !isEmpty && await this.appendFetchedChats(payload)

      this.loaded = isEmpty || currentChunkLength < chunkLength
      this.loading = false

      return true
    })

    let ref = this.currentUserChatsReference
      .orderByChild('lastMessage/timestamp')
      .limitToLast(chunkLength)

    // if (this.earliestFetchedChatTimestamp) {
    //   ref = ref.endAt(this.earliestFetchedChatTimestamp)
    // }

    if (this.lastChatTimestamp) {
      ref = ref.endAt(this.lastChatTimestamp)
    }

    return await ref.once('value').then(callback)
  }

  @action appendFetchedChats = async (payload) => {

    // TODO: handle condition
    const chats = await this.convertChats(payload)

    // const {value: chats} = await this.convertChatsSequence(payload).next()

    // TODO merge
    this.entities = {...this.entities, ...chats}

    await this.cacheMessenger()

    return true
  }

  convertChat = async (payload) => Object.values(await this.convertChats(payload))[0]

  convertChats = async (payload) => {
    const chatsPromises = Object.entries(payload)
      .map(async ([key, chat]) => {
        chat.user = await this.getStore(PEOPLE_STORE).getUserLazily(chat.userId)
        chat.key = key

        if (!chat.lastMessage) {
          chat.loaded = true
        }

        return chat
      })

    const chats = await Promise.all(chatsPromises)

    // Merging chats
    // TODO: should create new store for messages to get rid of that
    return chats.reduce((acc, chat) => {
      if (this.entities[chat.chatId]) {
        chat.messages = {...this.entities[chat.chatId].messages}
      }

      return {...acc, [chat.chatId]: chat}
    }, {})

  }

  @action appendChat = async (chat) => {
    const oldChat = this.entities[chat.chatId] || {}
    this.entities[chat.chatId] = {...oldChat, ...chat}
    await this.cacheMessenger()
    return this.entities[chat.chatId]
  }

  // TODO: add sync
  getChatWith = async (userId, user) => {
    console.log('GET CHAT:', 'checking chat')

    // const localChat = this.list.find(chat => chat.userId === userId)
    // if (localChat) return localChat.chatId

    const callback = async (snapshot) => {
      if (snapshot.exists()) {
        const payload = snapshot.val()

        const chat = await this.convertChat(payload)
        console.log('GET CHAT:', 'chat UID is', chat.chatId)
        await this.appendChat(chat)

        return chat.chatId

      } else {
        console.log('GET CHAT:', 'there is no chat with user', userId, 'yet')
        return null
      }
    }

    return await this.currentUserChatsReference
      .orderByChild('userId')
      .equalTo(userId)
      .once('value')
      .then(callback)
  }

  createChatWith = async (userId) => {
    console.log('CREATE CHAT:', 'start')

    const {chatId, key} = await
      firebase
        .functions()
        .httpsCallable('createChatWith')({userId})
        .then(res => res.data)
        .catch(console.error)

    console.log('CREATE CHAT:', 'chat created', chatId)

    await this.appendChat({chatId, userId, key, messages: {}, loaded: true})

    console.log('CREATE CHAT:', 'chat appended')

    return chatId
  }

  @action subscribeOnMessages = (chatId) => {
    console.log('SUBSCRIBE ON MESSAGES:', 'start')

    if (this.entities[chatId].subscribed) return
    this.entities[chatId].subscribed = true

    const callback = async (snapshot) => {
      console.log('SUBSCRIBE ON MESSAGES:', 'get data')

      // TODO: Rename 'user' to 'userId'
      const message = snapshot.val()

      message.key = snapshot.key
      message.userId = message.user

      if (message.attachments) {
        message.attachments = await this.getStore(ATTACHMENTS_STORE).convertAttachments(message.attachments)
      }

      this.appendMessage(chatId, message)
      // this.cacheMessenger()
    }

    this.getChatReference(chatId)
      .limitToLast(1)
      .on('child_added', callback)
  }

  // TODO
  // fetchMessages = (chatId) => this.fetchEntities(
  //   () => this.getChatReference(chatId).orderByKey(),
  //   this.appendFetchedMessages.bind(null, chatId),
  //   MESSAGES_CHUNK_LENGTH,
  //   this.entities[chatId])

  @action fetchMessages = (chatId) => {
    console.log('FETCH MESSAGES:', 'start')

    if (this.entities[chatId].loaded || this.entities[chatId].loading) return
    this.entities[chatId].loading = true

    const lastMessage = this.getLastFetchedMessage(chatId)
    const chunkShift = lastMessage ? 1 : 0
    const chunkLength = MESSAGES_CHUNK_LENGTH + chunkShift

    const callback = action(async (snapshot) => {
      const payload = snapshot.val() || {}

      const currentChunkLength = Object.keys(payload).length
      const isEmpty = currentChunkLength === chunkShift

      !isEmpty && await this.appendFetchedMessages(chatId, payload)

      this.entities[chatId].loaded = isEmpty || currentChunkLength < chunkLength
      this.entities[chatId].loading = false
    })

    let ref = this.getChatReference(chatId)
      .orderByKey()
      .limitToLast(chunkLength)

    if (lastMessage) {
      ref = ref.endAt(lastMessage.key)
    }

    ref.once('value', callback)

  }

  @action convertFetchedMessages = async (payload) => {
    const messagesPromises = Object.entries(payload)
      .map(async ([key, message]) => {
        message.key = key
        message.userId = message.user

        if (message.attachments) {
          message.attachments = await this.getStore(ATTACHMENTS_STORE).convertAttachments(message.attachments)
        }

        return message

      })

    const messages = await Promise.all(messagesPromises)

    return messages.reduce((acc, message) => ({...acc, [message.key]: message}), {})
  }

  @action appendFetchedMessages = async (chatId, payload) => {
    const messages = await this.convertFetchedMessages(payload)
    // .then(messages => messages.reduce((acc, message) => ({...acc, [message.key]: message}), {}))

    if (!this.entities[chatId].messages) {
      this.entities[chatId].messages = {}
    }

    this.entities[chatId].messages = {...this.entities[chatId].messages, ...messages}
    // this.cacheMessenger()

  }

  // TODO: change temporary message uid to actual
  @action appendMessage = (chatId, message) => {
    if (!this.entities[chatId].messages) {
      this.entities[chatId].messages = {}
    }

    // TODO: handle this
    if (this.entities[chatId].messages[message.token]) {
      delete this.entities[chatId].messages[message.token]
    }

    this.entities[chatId].messages[message.key] = message
    // this.cacheMessenger()
  }

  // TODO: Clean this mess
  sendMessage = (text, chatId) => {
    if (!text) return

    // https://github.com/omiceron/firebase-functions-example
    const sendMessage = firebase.functions().httpsCallable('sendMessage')

    const key = String(Date.now())

    const tempMessage = {
      text,
      key,
      timestamp: Date.now(),
      userId: this.user.uid,
      pending: true,
      attachments: this.getTempAttachments(chatId)
    }

    this.appendMessage(chatId, tempMessage)

    const message = {
      text,
      chatId,
      attachments: this.attachmentsToDb(chatId),
      token: key
    }

    sendMessage(message)
      .then(res => {
        console.log('SEND MESSAGE:', 'got server respond', res.data.key)
      })
      .catch(console.error)

    this.clearAttachments(chatId)
  }

  @action deleteChat = (chatId) => {
    if (!this.entities[chatId]) return

    this.currentUserChatsReference
      .child(this.entities[chatId].key)
      .update({deleted: true})

    delete this.entities[chatId]

  }

  @action archiveChat = (chatId) => {
    if (!this.entities[chatId]) return

    this.currentUserChatsReference
      .child(this.entities[chatId].key)
      .update({archived: true})

    delete this.entities[chatId]

  }

  off() {
    this.currentUserChatsReference.off()
    this.lastChatTimestamp = null
    Object.keys(this.entities).forEach(chatId => {
      this.getChatReference(chatId).off()
    })

    this.clear()
  }

  // convertChat = async (payload) => Object.values(await this.convertChats(payload))[0]
  //
  // convertChats = async (payload) => {
  //
  //   return Object.entries(payload)
  //     .reduce(async (accPromise, [key, chat]) => {
  //         const acc = await accPromise
  //
  //         chat.user = await this.getStore(PEOPLE_STORE).getUserLazily(chat.userId)
  //         chat.key = key
  //
  //         if (!chat.lastMessage) {
  //           chat.loaded = true
  //         }
  //
  //         // TODO: Can be an async conflict
  //         if (this.entities[chat.chatId]) {
  //           chat.messages = {...this.entities[chat.chatId].messages}
  //         }
  //
  //         return {...acc, [chat.chatId]: chat}
  //       }, Promise.resolve({})
  //     )
  // }

}

export default MessengerStore