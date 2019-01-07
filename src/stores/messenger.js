import {observable, action, computed} from 'mobx'
import firebase from 'firebase/app'
import EntitiesStore from './entities-store'
import {messagesFromFirebase} from './utils'
import {CHATS_REFERENCE, MESSAGES_REFERENCE, PEOPLE_REFERENCE, PEOPLE_STORE} from '../constants'

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

  @computed
  get orderedChats() {
    return Object.values(this.entities)
      .sort((firstChat, secondChat) => {
        if (!firstChat.messages || !secondChat.messages) return true
        return firstChat.messages[0].timestamp < secondChat.messages[0].timestamp
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

  getMessages = (chatId) => {
    if (!this.entities[chatId]) return
    return [...this.entities[chatId].messages]
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
    const ref = this.getChatReference(chatId).limitToLast(20)
    const callback = (messageData) => {
      const {text, timestamp, user} = messageData.val()
      const {key: _id} = messageData

      const message = {
        _id,
        key: _id,
        timestamp,
        text,
        user: {
          _id: user
        }
      }

      this.appendChat(chatData)
      this.appendMessage(chatId, message)
    }

    ref.on('child_added', callback)
  }

  @action fetchPreviousMessages = (chatId) => {
    // console.log('Fetching started')

    if (!this.entities[chatId]) return

    if (this.entities[chatId].loaded) return
    if (this.entities[chatId].loading) return

    if (this.getMessages(chatId).length < 20) {
      this.entities[chatId].loaded = true
      return
    }

    this.entities[chatId].loading = true

    const ref = this.getChatReference(chatId)
      .orderByKey()
      .limitToLast(10)
      .endAt(this.DANGER_getLastMessage(chatId).key)

    const callback = action((data) => {
      const payload = messagesFromFirebase(data.val())

      if (payload.length <= 1) {
        this.entities[chatId].loading = false
        this.entities[chatId].loaded = true
        return
      }

      payload.pop()

      this.appendPreviousMessages(chatId, payload)
      this.entities[chatId].loading = false

    })

    ref.once('value', callback)

  }

  @action appendChat = (chatData) => {
    if (this.entities[chatData.chatId]) return
    this.entities[chatData.chatId] = chatData
  }

  @action appendMessage = (chatId, message) => {
    // if (!this.entities[chatId].messages) this.entities[chatId].messages = [message]
    // else
    this.entities[chatId].messages = [message, ...(this.entities[chatId].messages || [])]
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

    const message = {
      text: payload,
      user: this.user.uid,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    }
    this.getChatReference(chatId).push(message)
  }

  off() {
    this.currentUserChatsReference.off()

    Object.keys(this.entities).forEach(chatId => {
      this.getChatReference(chatId).off()
    })

    this.DEPRECATED_setChatId(null)
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

  DANGER_getLastMessage = (chatId) => {
    const {messages} = this.entities[chatId]
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

    if (typeof payload === 'string') {

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

    } else {

      // GiftedChat

      payload.forEach(({text, user: {_id}}) => {
        const message = {
          text,
          user: _id,
          timestamp: Date.now()
        }
        this.DEPRECATED_currentChatReference.push(message)
      })
    }
  }

}

export default MessengerStore