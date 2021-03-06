import {Dimensions, Easing} from 'react-native'
import Constants from 'expo-constants'
import * as FileSystem from 'expo-file-system'

export const CACHE_DIR = FileSystem.cacheDirectory
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

export const IMAGE_SEPARATOR_SIZE = 4
export const MESSAGE_IMAGE_MAX_SIZE = 300

export const MESSAGE_CONTAINER_WIDTH = WINDOW_WIDTH - WINDOW_WIDTH / 5
export const MESSAGE_MAGE_SIZE_RELATIVE = MESSAGE_CONTAINER_WIDTH - IMAGE_SEPARATOR_SIZE * 2
export const MESSAGE_IMAGE_SIZE =
    MESSAGE_MAGE_SIZE_RELATIVE > MESSAGE_IMAGE_MAX_SIZE ? MESSAGE_IMAGE_MAX_SIZE : MESSAGE_MAGE_SIZE_RELATIVE
export const POST_IMAGE_SIZE = WINDOW_WIDTH - 32 // margins and paddings

export const MESSAGE_BORDER_RADIUS = 12

export const DEFAULT_HEADER_COLOR = '#7a839e'
export const ACTIVE_TINT_COLOR = '#423c6d'
export const USER_MESSAGE_COLOR = '#423c6d'
export const MESSAGE_COLOR = '#eeeeee'
export const WARNING_COLOR = '#c7444a'
export const INFO_COLOR = '#eadcc1'
export const UNDERLAY_COLOR = '#F6F6F9'
export const OFFLINE_COLOR = '#7f7f7f'
export const LIKE_COLOR = '#f40003'

// export const DEFAULT_BACKGROUND_COLOR = '#eff4f4'

export const WHITE_TRANSPARENT_BACKGROUND_COLOR = 'rgba(255, 255, 253, 0.8)'
export const TABLE_VIEW_BORDER_COLOR = 'rgba(192, 192, 192, 0.5)'

export const SEPARATOR_LINE_COLOR = 'rgba(192, 192, 192, 0.5)'
export const SEPARATOR_DEFAULT_MARGIN = 8

export const WHITE_BACKGROUND_COLOR = '#fffffd'
export const INACTIVE_BACKGROUND_COLOR = '#ebebef'

export const BLACK_TEXT_COLOR = '#333333'
export const WHITE_TEXT_COLOR = '#fffffd'
export const INACTIVE_TEXT_COLOR = '#898990'
export const HIGHLIGHTED_TEXT_COLOR = '#94b5c2'

export const FEED_CHUNK_LENGTH = 10
export const CHATS_CHUNK_LENGTH = 7
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
export const CURRENT_USER_STORE = 'currentUser'
export const USERS_STORE = 'people'
export const AVATAR_STORE = 'avatar'
export const MESSENGER_STORE = 'messenger'
export const FEED_STORE = 'feed'
export const ATTACHMENTS_STORE = 'attachments'

export const POSTS_REFERENCE = 'posts'
export const CHATS_REFERENCE = 'chats'
export const MESSAGES_REFERENCE = 'messages'
export const LIKES_REFERENCE = 'likes'
export const USERS_REFERENCE = 'people'
export const USER_AVATAR_REFERENCE = 'avatar'

export const AVATARS_STORAGE_REFERENCE = 'avatars'
export const ATTACHMENTS_STORAGE_REFERENCE = 'attachments'
