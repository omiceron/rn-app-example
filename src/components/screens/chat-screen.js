import React, {Component, PureComponent} from 'react'
import {inject, observer} from 'mobx-react'
import Chat from '../messenger/chat'
import TouchableAvatar from '../common/touchable-avatar'
import {observable} from 'mobx'
import {MESSENGER_STORE} from '../../constants'
import PropTypes from 'prop-types'
import Loader from '../common/loader'

@inject(MESSENGER_STORE)
@observer
class ChatScreen extends Component {
  static propTypes = {
    messenger: PropTypes.shape({
      getChatWith: PropTypes.func.isRequired,
      createChatWith: PropTypes.func.isRequired
    }).isRequired
  }

  @observable chatId = null

  // Chat name must be same as username
  // flow
  static navigationOptions = ({navigation}) => {
    const {user, user: {firstName, avatar}} = navigation.state.params

    // const navigateToMessenger = () => {
    //   navigation.navigate('messenger')
    // }

    const navigateToUserScreen = () => {
      navigation.push('userScreen', {user})
    }

    return ({
      title: firstName,
      headerRight: <TouchableAvatar size = {40}
                                    style = {{marginRight: 10}}
                                    onPress = {navigateToUserScreen}
        // uri = {avatar}
      />,
      headerStyle: {
        backgroundColor: '#67E',
        borderBottomWidth: 0
      },
      headerTintColor: '#FFF',
      tabBarVisible: false
      // headerLeft: <HeaderBackButton tintColor = 'white' onPress = {navigateToMessenger}/>,
      // headerLeft: <HeaderLeft onPress = {navigateToMessenger}/>,

    })
  }

  async componentWillMount() {
    const {uid} = this.props.navigation.state.params.user
    const {messenger} = this.props
    this.chatId = await messenger.getChatWith(uid) || await messenger.createChatWith(uid)
    // console.log('get chat', this.chatId)
    messenger.DANGER_subscribeOnMessages(this.chatId)
  }

  render() {
    if (!this.chatId) return <Loader/>

    // console.log('render chat', this.chatId)

    return <Chat chatId = {this.chatId}/>
  }

}

export default ChatScreen