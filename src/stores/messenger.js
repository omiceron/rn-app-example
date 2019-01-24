import {observable, action, computed} from 'mobx'
import firebase from 'firebase/app'
import EntitiesStore from './entities-store'
import {messagesFromFirebase} from './utils'
import {CHATS_REFERENCE, MESSAGES_CHUNK_LENGTH, MESSAGES_REFERENCE, PEOPLE_REFERENCE, PEOPLE_STORE} from '../constants'

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

  // @computed
  // get orderedChats() {
  //   return Object.values(this.entities)
  //     .sort((firstChat, secondChat) => {
  //
  //       // TODO: messages existence check should be before calling this function
  //       if (!firstChat.messages || !secondChat.messages) return true
  //
  //       return firstChat.messages[0].timestamp < secondChat.messages[0].timestamp
  //     })
  // }

  @computed
  get DANGER_orderedChats() {
    return this.list
      .filter(({lastMessage}) => lastMessage)
      .sort(({lastMessage: a}, {lastMessage: b}) => b.timestamp - a.timestamp)
  }

  isChatLoaded = (chatId) => {
    if (!this.entities[chatId]) return
    return this.entities[chatId].loaded
  }

  isChatLoading = (chatId) => {
    if (!this.entities[chatId]) return
    return this.entities[chatId].loading
  }

  DANGER_getMessages = (chatId) => {
    const chat = this.entities[chatId]
    if (!chat || !chat.messages) return []
    return Object.values(chat.messages).sort((a, b) => a.timestamp < b.timestamp)
  }

  DANGER_getLastFetchedMessage = (chatId) => {
    const messages = this.DANGER_getMessages(chatId)
    return messages[messages.length - 1]
  }

  DANGER_getLastMessage = (chatId) => {
    const messages = this.DANGER_getMessages(chatId)
    return messages[0]

    // return this.entities[chatId].lastMessage || {}
  }

  getMessages = (chatId) => {
    if (!this.entities[chatId]) return
    return this.entities[chatId].messages
    // return [...this.entities[chatId].messages]
  }

  getLastMessage = (chatId) => {
    const {messages} = this.entities[chatId]
    return messages[messages.length - 1]
  }

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

  @computed
  get earliestFetchedChatTimestamp() {
    const chat = this.DANGER_orderedChats[this.size - 1]

    if (!chat) return

    return chat.lastMessage.timestamp
  }

  @action DANGER_subscribeOnChats = () => {
    const {fetchUserInfo} = this.getStore(PEOPLE_STORE)
    console.log('SUBSCRIBE ON CHATS:', 'start')

    const callback = async (snapshot) => {
      // this.loading = true

      console.log('SUBSCRIBE ON CHATS:', 'get data', snapshot.val())

      const [chat] = Object.entries(snapshot.val())
        .map(([key, chat]) => ({...chat, key}))

      chat.user = await fetchUserInfo(chat.userId)

      this.appendChat(chat)

      // this.loading = false

    }

    this.currentUserChatsReference
      .orderByChild('lastMessage/timestamp')
      .limitToLast(1)
      .on('value', callback)

  }

  @action DANGER_fetchChats = () => {
    if (this.loaded || this.loading) return

    this.loading = true

    const chunkShift = this.earliestFetchedChatTimestamp ? 1 : 0
    const chunkLength = 8 + chunkShift

    const callback = action(async (snapshot) => {
      const payload = snapshot.val() || {}
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
    const {fetchUserInfo} = this.getStore(PEOPLE_STORE)

    const chats = await Promise.resolve(Object.entries(payload)
      .reduce(async (accPromise, [key, chat]) => {
          const acc = await accPromise

          if (!this.entities[chat.chatId]) {
            chat.user = await fetchUserInfo(chat.userId)
            chat.key = key
            acc[chat.chatId] = chat
          }

          return acc
        }, {}
      ))

    this.entities = {...this.entities, ...chats}
  }

  @action DANGER_subscribeOnMessages = (chatId) => {
    const chat = this.entities[chatId]
    console.log('SUBSCRIBE ON MESSAGES:', 'start')

    const callback = (snapshot) => {
      console.log('SUBSCRIBE ON MESSAGES:', 'get data', snapshot.val())

      // TODO: Rename 'user' to 'userId'
      const {text, timestamp, user} = snapshot.val()
      const {key} = snapshot

      const message = {
        key,
        timestamp,
        text,
        userId: user
      }
      // this.appendChat(chat)

      this.DANGER_appendMessage(chatId, message)
    }

    this.getChatReference(chatId)
      .limitToLast(1)
      .on('child_added', callback)
  }

  @action subscribeOnChats = () => {

    const callback = async (chatData) => {
      const {fetchUserInfo} = this.getStore(PEOPLE_STORE)
      const {userId} = chatData.val()

      this.subscribeOnMessages({
        ...chatData.val(),
        key: chatData.key,
        user: await fetchUserInfo(userId),
        loaded: false,
        loading: false
      })

    }

    this.currentUserChatsReference
    // .orderByChild('timestamp')
    // .orderByChild('visibility')
    // .equalTo(true)
    // .limitToLast(3)
      .on('child_added', callback)

  }

  @action subscribeOnMessages = (chatData) => {
    const {chatId} = chatData

    const callback = (snapshot) => {

      // TODO: Rename 'user' to 'userId'
      const {text, timestamp, user} = snapshot.val()
      const {key} = snapshot

      const message = {
        key,
        timestamp,
        text,
        userId: user
      }

      this.appendChat(chatData)
      this.appendMessage(chatId, message)
    }

    this.getChatReference(chatId).limitToLast(20).on('child_added', callback)
  }

  @action fetchPreviousMessages = (chatId) => {
    const chat = this.entities[chatId]

    if (chat.loaded || chat.loading) return

    if (this.getMessages(chatId).length < 20) {
      chat.loaded = true
      return
    }

    chat.loading = true

    const callback = action((data) => {
      const payload = messagesFromFirebase(data.val())

      if (payload.length <= 1) {
        chat.loading = false
        chat.loaded = true
        return
      }

      payload.pop()

      this.appendPreviousMessages(chatId, payload)
      chat.loading = false

    })

    this.getChatReference(chatId)
      .orderByKey()
      .limitToLast(10)
      .endAt(this.getLastMessage(chatId).key)
      .once('value', callback)

  }

  @action DANGER_fetchMessages = (chatId) => {
    const chat = this.entities[chatId]

    console.log('start fetching messages')

    if (chat.loaded || chat.loading) return

    chat.loading = true

    const lastMessage = this.DANGER_getLastFetchedMessage(chatId)
    const chunkShift = lastMessage ? 1 : 0
    const chunkLength = MESSAGES_CHUNK_LENGTH + chunkShift

    const callback = action((snapshot) => {
      const payload = snapshot.val() || {}

      const currentChunkLength = Object.keys(payload).length
      const isEmpty = currentChunkLength === chunkShift

      !isEmpty && this.DANGER_appendFetchedMessages(chatId, payload)

      chat.loaded = isEmpty || currentChunkLength < chunkLength
      chat.loading = false

    })

    let ref = this.getChatReference(chatId)
      .orderByKey()
      .limitToLast(chunkLength)

    if (lastMessage) {
      ref = ref.endAt(lastMessage.key)
    }

    ref.once('value', callback)

  }

  @action DANGER_appendFetchedMessages = (chatId, payload) => {
    Object
      .entries(payload)
      .forEach(([key, message]) =>
        this.DANGER_appendMessage(chatId, {...message, userId: message.user, key}))
  }

  @action appendChat = (chatData) => {
    const chat = this.entities[chatData.chatId]

    this.entities[chatData.chatId] = {...(chat || {}), ...chatData}
  }

  @action appendMessage = (chatId, message) => {
    // if (!this.entities[chatId].messages) this.entities[chatId].messages = [message]
    // else
    this.entities[chatId].messages = [message, ...(this.entities[chatId].messages || [])]
  }

  @action DANGER_appendMessage = (chatId, message) => {
    console.log('APPEND MESSAGE:', 'start')

    if (!this.entities[chatId].messages) {
      console.log('APPEND MESSAGE:', 'no messages')
      this.entities[chatId].messages = {}
    }

    this.entities[chatId].messages[message.key] = message
    console.log('APPEND MESSAGE:', 'message appended')
  }

  @action appendPreviousMessages = (chatId, messages) => {
    this.entities[chatId].messages = [...this.entities[chatId].messages, ...messages.reverse()]
  }

  getChatWith = async (userId) => {
    console.log('GET CHAT:', 'checking chat')

    const callback = (snapshot) => {
      if (snapshot.exists()) {
        const {chatId} = Object.values(snapshot.val())[0]
        console.log('GET CHAT:', 'chat UID is', chatId)
        return chatId
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

    const chatId = await
      firebase
        .functions()
        .httpsCallable('createChatWith')({userId})
        .then(res => res.data)
        .catch(console.error)

    console.log('CREATE CHAT:', 'chat created')

    this.appendChat({chatId, userId, messages: {}})

    console.log('CREATE CHAT:', 'chat appended')

    return chatId
  }

  sendMessage = (text, chatId) => {
    if (!text) return

    // https://github.com/omiceron/firebase-functions-example
    const sendMessage = firebase.functions().httpsCallable('sendMessage')

    sendMessage({text, chatId})
      .then(res => console.log('SEND MESSAGE:', 'got server respond', res.data))
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