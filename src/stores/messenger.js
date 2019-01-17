import {observable, action, computed} from 'mobx'
import firebase from 'firebase/app'
import EntitiesStore from './entities-store'
import {messagesFromFirebase} from './utils'
import {CHATS_REFERENCE, MESSAGES_CHUNK_LENGTH, MESSAGES_REFERENCE, PEOPLE_REFERENCE, PEOPLE_STORE} from '../constants'

// 1. Asynchronous operations should work proper.
//    No key duplicates, no setting chat ID delay
// 2. Chats getter sorting issue
// 3. Messages should be converted in utils
// 4. Visibility issue
// 5. Subscribe after fetching 20 messages

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
    return this.list.sort(({lastMessage: a}, {lastMessage: b}) => {
      // console.log('sort', this.user.uid)

      if (!a || !b) return true

      return a.timestamp < b.timestamp

      // return this.DANGER_getLastMessage(aC).timestamp < this.DANGER_getLastMessage(bC).timestamp

    })
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
    if (!chat.messages) return []
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

  get latestTimestamp() {
    return this.DANGER_orderedChats[0].lastMessage.timestamp
  }

  @action DANGER_subscribeOnChats = () => {
    const {fetchUserInfo} = this.getStore(PEOPLE_STORE)

    const callback = async (snapshot) => {
      const chat = {
        ...snapshot.val(),
        key: snapshot.key,
        // key: chat.chatId,
        user: await fetchUserInfo(snapshot.val().userId),
        loaded: false,
        loading: false
      }

      this.DANGER_subscribeOnMessages(chat)

    }

    const callback2 = async (snapshot) => {

      let [chat] = Object.entries(snapshot.val())
        .map(([key, chat]) => ({...chat, key}))
      // console.log(chat)
      chat.user = await fetchUserInfo(chat.userId)

      this.appendChat(chat)

    }

    this.currentUserChatsReference.orderByChild('lastMessage/timestamp')
      .limitToLast(1).on('value', callback2)

    // this.currentUserChatsReference.on('child_added', callback)
  }

  @action DANGER_fetchPreviousChats = () => {
    if (this.loaded || this.loading) return

    this.loading = true

    const chunkShift = this.latestTimestamp ? 1 : 0
    const chunkLength = 10 + chunkShift

    const callback = action(async (snapshot) => {
      const payload = snapshot.val() || {}
      const currentChunkLength = Object.keys(payload).length
      const isEmpty = currentChunkLength === chunkShift

      !isEmpty && await this.appendFetchedChats(payload)
      this.loaded = isEmpty || currentChunkLength < chunkLength
      this.loading = false
    })

    this.currentUserChatsReference
      .orderByChild('lastMessage/timestamp')
      .limitToLast(chunkLength)
      .endAt(this.latestTimestamp)
      .once('value', callback)
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

    const callback = (snapshot) => {
      // console.log(snapshot.val())

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

  @action DANGER_fetchPreviousMessages = (chatId) => {
    const chat = this.entities[chatId]

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
    if (!this.entities[chatId].messages) {
      this.entities[chatId].messages = {}
    }

    this.entities[chatId].messages[message.key] = message
  }

  @action appendPreviousMessages = (chatId, messages) => {
    this.entities[chatId].messages = [...this.entities[chatId].messages, ...messages.reverse()]
  }

  getChatWith = async (userId) => {
    console.log('Checking chat...')

    const callback = (data) => {
      if (data.exists()) {
        const {chatId} = Object.values(data.val())[0]
        console.log('Chat UID is', chatId)
        return chatId
      } else {
        console.log('There is no chat with user', uid, 'yet')
        return null
      }
    }

    return await this.currentUserChatsReference
      .orderByChild('userId')
      .equalTo(userId)
      .once('value')
      .then(callback)
  }

  createChatWith = (userId) => {

    console.log('Creating new chat...')

    const {key: chatId} = firebase.database()
      .ref(CHATS_REFERENCE)
      .push({visibility: false})

    this.currentUserChatsReference
      .push({userId, chatId, visibility: false})

    if (userId === this.user.uid) {
      console.log('Self chat', chatId, 'was successfully created')
      return chatId
    }

    this.getUserChatsReference(userId)
      .push({userId: this.user.uid, chatId, visibility: false})

    console.log('Chat', chatId, 'was successfully created')

    return chatId

  }

  @action deleteChat = (chatId) => {
    if (!this.entities[chatId]) return
    delete this.entities[chatId]
  }

  sendMessage = (payload, chatId) => {
    if (!payload) return

    // TODO: Rename 'user' to 'userId'
    const message = {
      text: payload,
      user: this.user.uid,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }

    this.getChatReference(chatId).push(message)

    // Experimental functions. This concerns backend,
    // but firebase has no functional like that
    const chat = this.entities[chatId]

    this.currentUserChatsReference
      .child(chat.key)
      .child('lastMessage')
      .update(message)

    const recipientRef = this.getUserChatsReference(chat.userId)

    recipientRef
      .orderByChild('chatId')
      .equalTo(chatId)
      .once('value')
      .then(snapshot => {
        const [key] = Object.keys(snapshot.val())

        recipientRef
          .child(key)
          .child('lastMessage')
          .update(message)
      })
  }

  off() {
    this.currentUserChatsReference.off()

    Object.keys(this.entities).forEach(chatId => {
      this.getChatReference(chatId).off()
    })

    this.clear()
  }

  // DEPRECATED FUNCTIONS

  @observable DEPRECATED_chatId = null

  @action DEPRECATED_fetchPreviousMessages = () => {
    // console.log('Fetching started')
    if (this.DEPRECATED_currentChatLoaded || this.DEPRECATED_currentChatLoading) return

    if (this.DEPRECATED_messages.length < 20) {
      this.DEPRECATED_setCurrentChatLoaded(true)
      return
    }

    this.DEPRECATED_setCurrentChatLoading(true)

    const ref = this.DEPRECATED_currentChatReference
      .orderByKey()
      .limitToLast(10)
      .endAt(this.DEPRECATED_lastMessage.key)

    const callback = action((data) => {
      const payload = messagesFromFirebase(data.val())

      if (payload.length <= 1) {
        this.DEPRECATED_setCurrentChatLoading(false)
        this.DEPRECATED_setCurrentChatLoaded(true)
        return
      }

      payload.pop()

      this.appendPreviousMessages(this.DEPRECATED_chatId, payload)
      this.DEPRECATED_setCurrentChatLoading(false)

    })

    ref.once('value', callback)

  }

  @computed
  get DEPRECATED_currentChatLoaded() {
    if (!this.entities[this.DEPRECATED_chatId]) return
    return this.entities[this.DEPRECATED_chatId].loaded
  }

  get DEPRECATED_currentChatReference() {
    return this.getChatReference(this.DEPRECATED_chatId)
  }

  get DEPRECATED_lastMessage() {
    const {messages} = this.entities[this.DEPRECATED_chatId]
    return messages[messages.length - 1]
  }

  @computed
  get DEPRECATED_messages() {
    if (!this.entities[this.DEPRECATED_chatId]) return
    return [...this.entities[this.DEPRECATED_chatId].messages]
  }

  @computed
  get DEPRECATED_currentChatLoading() {
    if (!this.entities[this.DEPRECATED_chatId]) return
    return this.entities[this.DEPRECATED_chatId].loading
  }

  @action DEPRECATED_setCurrentChatLoaded = (isLoaded = true) => {
    this.entities[this.DEPRECATED_chatId].loaded = isLoaded
  }

  @action DEPRECATED_setCurrentChatLoading = (isLoading = true) => {
    this.entities[this.DEPRECATED_chatId].loading = isLoading
  }

  @action DEPRECATED_setChatId = chatId => {
    // console.log('chat id has been set')
    this.DEPRECATED_chatId = chatId
  }

  @computed
  get DEPRECATED_currentChatVisibility() {
    return this.entities[this.DEPRECATED_chatId].visibility
  }

  @action DEPRECATED_setCurrentChatVisibility = (isVisible = true) => {
    this.entities[this.DEPRECATED_chatId].visibility = isVisible
  }

  DEPRECATED_sendMessage = (payload) => {

    if (!payload) return

    const message = {
      text: payload,
      user: this.user.uid,
      timestamp: Date.now()
    }

    /*      // if (!this.currentChatVisibility) {
            this.setCurrentChatVisibility(true)

            // this.currentUserChatsReference.orderByChild('chatId').equalTo(this.chatId).update({visibility: true})

            this.currentUserChatsReference
              .child(this.entities[this.chatId].key)
              .child('visibility')
              .set(true)

            this.currentUserChatsReference
              .child(this.entities[this.chatId].key)
              .child('timestamp')
              .set(Date.now())*/

    this.DEPRECATED_currentChatReference.push(message)
  }

}

export default MessengerStore