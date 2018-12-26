import '../config'
import AuthStore from './auth'
import UserStore from './user'
import KeyboardStore from './keyboard'
import UserAvatarStore from './user-avatar'
import NavigationStore from './navigation'
import PeopleStore from './people'
import EventsStore from './events'
import FeedStore from './feed'
import MessengerStore from "./messenger"
import {
  AUTH_STORE,
  KEYBOARD_STORE,
  NAVIGATION_STORE,
  AVATAR_STORE,
  EVENTS_STORE,
  MESSENGER_STORE,
  PEOPLE_STORE,
  USER_STORE,
  FEED_STORE
} from "../constants"

const stores = {}

stores[USER_STORE] = new UserStore(stores)
stores[FEED_STORE] = new FeedStore(stores)
stores[KEYBOARD_STORE] = new KeyboardStore(stores)
stores[AVATAR_STORE] = new UserAvatarStore(stores)
stores[AUTH_STORE] = new AuthStore(stores)
stores[NAVIGATION_STORE] = new NavigationStore(stores)
stores[PEOPLE_STORE] = new PeopleStore(stores)
stores[EVENTS_STORE] = new EventsStore(stores)
stores[MESSENGER_STORE] = new MessengerStore(stores)

export default stores