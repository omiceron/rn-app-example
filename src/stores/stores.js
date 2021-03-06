// import '../backend'
import {initializeBackend} from '../backend'
import AuthStore from './auth'
import UserStore from './user'
import KeyboardStore from './keyboard'
import UserAvatarStore from './user-avatar'
import NavigationStore from './navigation'
import UsersStore from './users'
import FeedStore from './feed'
import MessengerStore from './messenger'
import {
    AUTH_STORE,
    KEYBOARD_STORE,
    NAVIGATION_STORE,
    AVATAR_STORE,
    MESSENGER_STORE,
    USERS_STORE,
    CURRENT_USER_STORE,
    FEED_STORE,
    ATTACHMENTS_STORE
} from '../constants'
import AttachmentsStore from './attachments'

initializeBackend()

const stores = {}

stores[CURRENT_USER_STORE] = new UserStore(stores, CURRENT_USER_STORE)
stores[KEYBOARD_STORE] = new KeyboardStore(stores, KEYBOARD_STORE)
stores[ATTACHMENTS_STORE] = new AttachmentsStore(stores, ATTACHMENTS_STORE)
stores[FEED_STORE] = new FeedStore(stores, FEED_STORE)
stores[AVATAR_STORE] = new UserAvatarStore(stores, AVATAR_STORE)
stores[AUTH_STORE] = new AuthStore(stores, AUTH_STORE)
stores[NAVIGATION_STORE] = new NavigationStore(stores, NAVIGATION_STORE)
stores[USERS_STORE] = new UsersStore(stores, USERS_STORE)
stores[MESSENGER_STORE] = new MessengerStore(stores, MESSENGER_STORE)

export default stores
