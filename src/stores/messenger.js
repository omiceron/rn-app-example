import {action, computed} from 'mobx'
import firebase from 'firebase/app'
import EntitiesStore from './entities-store'
import {CHATS_REFERENCE, MESSAGES_CHUNK_LENGTH, MESSAGES_REFERENCE, PEOPLE_REFERENCE, PEOPLE_STORE} from '../constants'

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
  get orderedChats() {
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

  getMessages = (chatId) => {
    const chat = this.entities[chatId]
    if (!chat || !chat.messages) return []
    return Object.values(chat.messages).sort((a, b) => a.timestamp < b.timestamp)
  }

  getLastFetchedMessage = (chatId) => {
    const messages = this.getMessages(chatId)
    return messages[messages.length - 1]
  }

  @computed
  get earliestFetchedChatTimestamp() {
    const chat = this.orderedChats[this.size - 1]

    if (!chat) return

    return chat.lastMessage.timestamp
  }

  @action subscribeOnChats = () => {
    console.log('SUBSCRIBE ON CHATS:', 'start')

    const callback = async (snapshot) => {

      console.log('SUBSCRIBE ON CHATS:', 'get data')

      await this.convertChat(snapshot.val())
        .then(this.appendChat)
    }

    this.currentUserChatsReference
      .orderByChild('lastMessage/timestamp')
      .limitToLast(1)
      .on('value', callback)

  }

  @action fetchChats = () => {
    if (this.loaded || this.loading) return

    console.log('FETCH CHATS:', 'start')
    this.loading = true

    const chunkShift = this.earliestFetchedChatTimestamp ? 1 : 0
    const chunkLength = 8 + chunkShift

    const callback = action(async (snapshot) => {
      const payload = snapshot.val() || {}
      console.log(payload)
      const currentChunkLength = Object.keys(payload).length
      const isEmpty = currentChunkLength === chunkShift

      !isEmpty && await this.appendFetchedChats(payload)
      this.loaded = isEmpty || currentChunkLength < chunkLength
      this.loading = false
    })

    let ref = this.currentUserChatsReference
      .orderByChild('lastMessage/timestamp')
      .limitToLast(chunkLength)

    if (this.earliestFetchedChatTimestamp) {
      ref = ref.endAt(this.earliestFetchedChatTimestamp)
    }

    ref.once('value', callback)
  }

  @action appendFetchedChats = async (payload) => {
    // const {fetchUserInfo} = this.getStore(PEOPLE_STORE)

    // Object.entries(payload).forEach(async ([key, chat]) => {
    //   if (!this.entities[chat.chatId]) {
    //     chat.user = await fetchUserInfo(chat.userId)
    //     chat.key = key
    //     this.appendChat(chat)
    //   }
    // })

    // const chats = await Promise.resolve(Object.entries(payload)
    //   .reduce(async (accPromise, [key, chat]) => {
    //       const acc = await accPromise
    //
    //       if (!this.entities[chat.chatId]) {
    //         chat.user = await fetchUserInfo(chat.userId)
    //         chat.key = key
    //         acc[chat.chatId] = chat
    //       }
    //
    //       return acc
    //     }, {}
    //   ))

    const chats = await
      this.convertChats(payload)
        .then(chats => chats.reduce((acc, chat) => {
          if (!this.entities[chat.chatId]) {
            acc[chat.chatId] = chat
          }
          return acc
        }), {})

    this.entities = {...this.entities, ...chats}

  }

  @action subscribeOnMessages = (chatId) => {
    console.log('SUBSCRIBE ON MESSAGES:', 'start')

    if (this.entities[chatId].subscribed) return

    const callback = (snapshot) => {
      console.log('SUBSCRIBE ON MESSAGES:', 'get data', snapshot.val())

      // TODO: Rename 'user' to 'userId'
      const {text, timestamp, user, token} = snapshot.val()
      const {key} = snapshot

      const message = {
        key,
        token,
        timestamp,
        text,
        userId: user
      }

      this.appendMessage(chatId, message)
    }

    this.entities[chatId].subscribed = true

    this.getChatReference(chatId)
      .limitToLast(1)
      .on('child_added', callback)
  }

  @action fetchMessages = (chatId) => {
    console.log('FETCH MESSAGES:', 'start')
    if (this.entities[chatId].loaded || this.entities[chatId].loading) return

    this.entities[chatId].loading = true

    const lastMessage = this.getLastFetchedMessage(chatId)
    const chunkShift = lastMessage ? 1 : 0
    const chunkLength = MESSAGES_CHUNK_LENGTH + chunkShift

    const callback = action((snapshot) => {
      const payload = snapshot.val() || {}

      const currentChunkLength = Object.keys(payload).length
      const isEmpty = currentChunkLength === chunkShift

      !isEmpty && this.appendFetchedMessages(chatId, payload)

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

  @action appendFetchedMessages = (chatId, payload) => {
    Object
      .entries(payload)
      .forEach(([key, message]) =>
        this.appendMessage(chatId, {...message, userId: message.user, key}))
  }

  convertChat = async (payload) => {
    const {fetchUserInfo} = this.getStore(PEOPLE_STORE)

    const [chat] = Object.entries(payload).map(([key, chat]) => ({...chat, key}))

    chat.loaded = !chat.lastMessage
    chat.user = await fetchUserInfo(chat.userId)

    return chat
  }

  convertChats = async (payload) => {
    const {fetchUserInfo} = this.getStore(PEOPLE_STORE)

    return await Promise.all(Object.entries(payload).map(async ([key, chat]) => {
      chat.user = await fetchUserInfo(chat.userId)
      chat.loaded = !chat.lastMessage

      return ({...chat, key})
    }))
  }

  @action appendChat = (chatData) => {
    const chat = this.entities[chatData.chatId]

    this.entities[chatData.chatId] = {...(chat || {}), ...chatData}

    return chatData
  }

  @action appendMessage = (chatId, message) => {
    // console.log('APPEND MESSAGE:', 'start')
    if (!this.entities[chatId].messages) {
      // console.log('APPEND MESSAGE:', 'no messages')
      this.entities[chatId].messages = {}
    }

    if (this.entities[chatId].messages[message.token]) {
      this.entities[chatId].messages[message.token] = message
    } else {
      this.entities[chatId].messages[message.key] = message
    }

    // console.log('APPEND MESSAGE:', 'message appended')
  }

  getChatWith = async (userId, user) => {
    console.log('GET CHAT:', 'checking chat')

    const callback = async (snapshot) => {
      if (snapshot.exists()) {
        const chat = await this.convertChat(snapshot.val())
        console.log('GET CHAT:', 'chat UID is', chat.chatId)

        this.appendChat(chat)

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

    this.appendChat({chatId, userId, key, messages: {}, loaded: true})

    console.log('CREATE CHAT:', 'chat appended')

    return chatId
  }

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
      pending: true
    }

    this.appendMessage(chatId, tempMessage)

    sendMessage({text, chatId, token: key})
      .then(res => {
        console.log('SEND MESSAGE:', 'got server respond', res.data.key)
      })
      .catch(console.error)

  }

  @action deleteChat = (chatId) => {
    if (!this.entities[chatId]) return
    delete this.entities[chatId]
  }

  off() {
    this.currentUserChatsReference.off()

    Object.keys(this.entities).forEach(chatId => {
      this.getChatReference(chatId).off()
    })

    this.clear()
  }

}

export default MessengerStore