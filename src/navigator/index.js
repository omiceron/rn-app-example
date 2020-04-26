import {createAppContainer, createSwitchNavigator, getActiveChildNavigationOptions} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack'
import {createBottomTabNavigator} from 'react-navigation-tabs'
import AuthScreen from './screens/auth-screen'
import SignUpScreen from './screens/sign-up-screen'
import PeopleScreen from './screens/users-screen'
import PersonPhotoScreen from './screens/person-photo-screen'
import UserPhotoScreen from './screens/user-photo-screen'
import MessengerScreen from './screens/messenger-screen'
import ChatScreen from './screens/chat-screen'
import UserInfo from './screens/user-screen'
import UserAvatarsScreen from './screens/user-avatars-screen'
import SettingsScreen from './screens/settings-screen'
import FeedScreen from './screens/feed-screen'
import PostFormScreen from './screens/post-form-screen'
import LocationFormScreen from './screens/location-form-screen'
import LikesListScreen from './screens/likes-list-screen'
import PostScreen from './screens/post-screen'
import AuthLoadingScreen from './screens/loader-screen'
import MapScreen from './screens/map-screen'
import {
    ACTIVE_TINT_COLOR,
    DEFAULT_HEADER_COLOR,
    INACTIVE_TEXT_COLOR,
    WHITE_BACKGROUND_COLOR,
    WHITE_TEXT_COLOR
} from '../constants'
import {createTabBarIcon} from './utils/create-tab-bar-icon'

const commonScreens = {
    postScreen: {
        screen: PostScreen
    },
    userScreen: {
        screen: UserInfo
    },
    likesList: {
        screen: LikesListScreen
    },
    chatScreen: {
        screen: ChatScreen
    },
    mapScreen: {
        screen: MapScreen
    }
}

const createCommonStack = (mainScreen) =>
    createStackNavigator(
        {
            mainScreen,
            ...commonScreens
        },
        {
            defaultNavigationOptions: {
                headerStyle: {
                    backgroundColor: DEFAULT_HEADER_COLOR,
                    borderBottomWidth: 0
                },
                headerTintColor: WHITE_TEXT_COLOR
            },
            headerMode: 'float'
            // DEPRECATED!
            // headerTransitionPreset: 'uikit'
        }
    )

const AuthNavigator = createStackNavigator(
    {
        signIn: {
            screen: AuthScreen
        },
        signUp: {
            screen: SignUpScreen
        }
    },
    {
        headerMode: 'none'
    }
)

const PostFormStack = createStackNavigator(
    {
        postForm: {
            screen: PostFormScreen
        },
        locationForm: {
            screen: LocationFormScreen
        }
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: DEFAULT_HEADER_COLOR,
                borderBottomWidth: 0
            },
            headerTintColor: WHITE_TEXT_COLOR
        },
        headerMode: 'float'
        // DEPRECATED!
        // headerTransitionPreset: 'uikit'
    }
)

const createCommonTabRouteConfig = (mainScreen, icon) => ({
    screen: createCommonStack(mainScreen),
    navigationOptions: ({navigation, screenProps}) => ({
        ...getActiveChildNavigationOptions(navigation, screenProps),
        headerShown: false,
        tabBarIcon: createTabBarIcon(icon)
    })
})

const TabNavigator = createBottomTabNavigator(
    {
        feed: createCommonTabRouteConfig(FeedScreen, 'paper'),
        messenger: createCommonTabRouteConfig(MessengerScreen, 'chatbubbles'),
        people: createCommonTabRouteConfig(PeopleScreen, 'people'),
        settings: {
            screen: SettingsScreen,
            navigationOptions: {
                tabBarIcon: createTabBarIcon('settings')
            }
        }
    },
    {
        tabBarOptions: {
            activeBackgroundColor: WHITE_BACKGROUND_COLOR,
            inactiveBackgroundColor: WHITE_BACKGROUND_COLOR,
            activeTintColor: ACTIVE_TINT_COLOR,
            inactiveTintColor: INACTIVE_TEXT_COLOR,
            showLabel: false
        }
    }
)

const CoreNavigator = createStackNavigator(
    {
        root: {
            screen: TabNavigator,
            navigationOptions: ({navigation, screenProps}) => getActiveChildNavigationOptions(navigation, screenProps)
        },
        personPhoto: {
            screen: PersonPhotoScreen
        },
        userPhoto: {
            screen: UserPhotoScreen
        },
        userAvatars: {
            screen: UserAvatarsScreen
        }
    },
    {
        headerMode: 'float'
        // DEPRECATED!
        // headerTransitionPreset: 'uikit'
    }
)

const ModalNavigator = createStackNavigator(
    {
        CoreNavigator,
        PostFormStack
    },
    {
        headerMode: 'none',
        mode: 'modal'
    }
)

const Navigator = createAppContainer(
    createSwitchNavigator({
        loading: {
            screen: AuthLoadingScreen
        },
        auth: {
            screen: AuthNavigator
        },
        app: {
            screen: ModalNavigator
        }
    })
)

export default Navigator
