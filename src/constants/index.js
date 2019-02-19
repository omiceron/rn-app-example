import {Dimensions, Easing} from 'react-native'
import {FileSystem, Constants} from 'expo'

export const LOCAL_AVATAR_URI = FileSystem.cacheDirectory
export const KEYBOARD_EASING = Easing.bezier(0.17, 0.59, 0.4, 0.77)
export const WINDOW_HEIGHT = Dimensions.get('window').height
export const WINDOW_WIDTH = Dimensions.get('window').width
export const STATUS_BAR_HEIGHT = Constants.statusBarHeight
export const HIT_SLOP = {left: 10, right: 10, top: 10, bottom: 10}
export const BACK_BUTTON_HEIGHT = 36
export const DIVIDER_MARGIN_TOP = 20
export const ROW_HEIGHT = 76
export const REGION_DELTAS = {latitudeDelta: 0.0922, longitudeDelta: 0.0421}
export const DATE_FORMAT = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
export const SHORT_DATE_FORMAT = {year: '2-digit', month: '2-digit', day: '2-digit'}
export const TIME_FORMAT = {hour: '2-digit', minute: '2-digit'}
export const LOCALE = 'en-GB'

export const DEFAULT_HEADER_COLOR = '#7a839e'
export const ACTIVE_TINT_COLOR = '#423c6d'
export const USER_MESSAGE_COLOR = '#423c6d'
export const MESSAGE_COLOR = '#eeeeee'
export const HIGHLIGHTED_TEXT_COLOR = '#94b5c2'
export const WARNING_COLOR = '#c7444a'
export const INFO_COLOR = '#eadcc1'
export const INACTIVE_TEXT_COLOR = '#898990'
export const UNDERLAY_COLOR = '#F6F6F9'
export const OFFLINE_COLOR = '#7f7f7f'

export const POST_CARD_BACKGROUND_COLOR = '#fffffd'
export const POST_CARD_TEXT_COLOR = '#898990'
export const POST_CARD_TITLE_COLOR = '#333333'
export const DEFAULT_BACKGROUND_COLOR = '#ebebef'
// export const DEFAULT_BACKGROUND_COLOR = '#eff4f4'
export const WHITE_BACKGROUND_COLOR = '#fffffd'
export const NAVIGATION_TINT_COLOR = '#fffffd'

export const FEED_CHUNK_LENGTH = 10
export const MESSAGES_CHUNK_LENGTH = 30

export const LOGO = 'logo'
export const INPUT = 'input'
export const TITLE = 'title'
export const FOOTER = 'footer'
export const BUTTON = 'button'
export const KEYBOARD = 'keyboard'
export const TRANSLATE = '-translate'
export const Y = '-y'
export const OPACITY = '-opacity'
export const SCALE = '-scale'
export const HEIGHT = '-height'

// export const TITLE = '-scale'

export const AUTH_STORE = 'auth'
export const KEYBOARD_STORE = 'keyboard'
export const NAVIGATION_STORE = 'navigation'
export const USER_STORE = 'user'
export const PEOPLE_STORE = 'people'
export const EVENTS_STORE = 'events'
export const AVATAR_STORE = 'avatar'
export const MESSENGER_STORE = 'messenger'
export const FEED_STORE = 'feed'

export const POSTS_REFERENCE = 'posts'
export const CHATS_REFERENCE = 'chats'
export const MESSAGES_REFERENCE = 'messages'
export const LIKES_REFERENCE = 'likes'
export const PEOPLE_REFERENCE = 'people'
export const USER_AVATAR_REFERENCE = 'avatar'

export const AVATARS_STORAGE_REFERENCE = 'avatars'