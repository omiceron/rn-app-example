import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  getActiveChildNavigationOptions,
  createAppContainer
} from 'react-navigation'
import AuthScreen from './screens/auth-screen'
import SignUpScreen from './screens/sign-up-screen'
import EventList from './screens/event-list'
import PeopleScreen from './screens/people-screen'
import EventMapScreen from './screens/event-map'
import PersonPhotoScreen from './screens/person-photo-screen'
import UserPhotoScreen from './screens/user-photo-screen'
import MessengerScreen from './screens/messenger-screen'
import ChatScreen from './screens/chat-screen'
import UserInfo from './screens/user-screen'
import UserAvatarsScreen from './screens/user-avatars-screen'
import SettingsScreen from './screens/settings-screen'
import Icon from 'react-native-vector-icons/Ionicons'
import React, {Component} from 'react'
import FeedScreen from './screens/feed-screen'
import PostFormScreen from './screens/post-form-screen'
import LocationFormScreen from './screens/location-form-screen'
import LikesListScreen from './screens/likes-list-screen'

const renderTabBarIcon = (name) => ({tintColor, focused}) =>
  <Icon name = {focused ? `ios-${name}` : `ios-${name}-outline`}
        size = {30}
        style = {{color: tintColor}}
  />

const AuthNavigator = createStackNavigator({
  signIn: {
    screen: AuthScreen
  },
  signUp: {
    screen: SignUpScreen
  }
}, {
  headerMode: 'none'
})

const PostFormNavigator = createStackNavigator({
  postForm: {
    screen: PostFormScreen
  },
  locationForm: {
    screen: LocationFormScreen
  }
}, {
  headerMode: 'float',
  headerTransitionPreset: 'uikit'
})

const TabNavigator = createBottomTabNavigator({
  messenger: {
    screen: MessengerScreen,
    navigationOptions: {
      tabBarIcon: renderTabBarIcon('chatbubbles')
    }
  },
  people: {
    screen: PeopleScreen,
    navigationOptions: {
      tabBarIcon: renderTabBarIcon('people')
    }
  },
  feed: {
    screen: FeedScreen,
    navigationOptions: {
      tabBarIcon: renderTabBarIcon('paper')
    }
  },
  events: {
    screen: EventList,
    navigationOptions: {
      tabBarIcon: renderTabBarIcon('calendar')
    }
  },
  settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarIcon: renderTabBarIcon('settings')
    }
  }
}, {
  tabBarOptions: {
    activeTintColor: '#67E',
    showLabel: false

  }
})

const CoreNavigator = createStackNavigator({
  root: {
    screen: TabNavigator,
    navigationOptions: ({navigation, screenProps}) => getActiveChildNavigationOptions(navigation, screenProps)
  },
  chatScreen: {
    screen: ChatScreen
  },
  userScreen: {
    screen: UserInfo
  },
  personPhoto: {
    screen: PersonPhotoScreen
  },
  userPhoto: {
    screen: UserPhotoScreen,
  },
  likesList: {
    screen: LikesListScreen
  },
  userAvatars: {
    screen: UserAvatarsScreen,
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#67E',
        borderBottomWidth: 0
      }
    }
  },
  event: {
    screen: EventMapScreen
  }
}, {
  headerMode: 'float',
  headerTransitionPreset: 'uikit'
})

const ModalNavigator = createStackNavigator({
  home: {
    screen: CoreNavigator
  },
  feed: {
    screen: PostFormNavigator
  },
}, {
  headerMode: 'none',
  mode: 'modal'
})

const AppNavigator = createAppContainer(createSwitchNavigator({
    auth: {
      screen: AuthNavigator
    },
    app: {
      screen: ModalNavigator
    }
  }
))

export default AppNavigator