import React, {Component, PureComponent} from 'react'
import {inject, observer} from 'mobx-react'
import Chat from '../../components/messenger/chat'
import TouchableAvatar from '../../components/ui/touchable-avatar'
import {observable} from 'mobx'
import {MESSENGER_STORE, USERS_STORE} from '../../constants'
import PropTypes from 'prop-types'
import Loader from '../../components/ui/loader'

@inject(USERS_STORE)
@inject(MESSENGER_STORE)
@observer
class ChatScreen extends Component {
    static propTypes = {
        messenger: PropTypes.shape({
            getChatWith: PropTypes.func.isRequired,
            createChatWith: PropTypes.func.isRequired
        })
    }

    @observable chatId = null

    // Chat name must be same as username
    // flow
    static navigationOptions = ({navigation}) => {
        // TODO: user object
        const {
            user: {firstName, avatar}
        } = navigation.state.params
        const {userId} = navigation.state.params

        const navigateToUserScreen = () => {
            navigation.push('userScreen', {userId})
        }

        return {
            title: firstName,
            headerRight: () => (
                <TouchableAvatar size={40} style={{marginRight: 10}} onPress={navigateToUserScreen} uri={avatar} />
            ),
            tabBarVisible: false
        }
    }

    async componentDidMount() {
        const {userId} = this.props.navigation.state.params
        const {messenger} = this.props
        this.chatId = (await messenger.getChatWith(userId)) || (await messenger.createChatWith(userId))
    }

    render() {
        if (this.props.messenger.loading || !this.chatId) return <Loader />
        return <Chat chatId={this.chatId} />
    }
}

export default ChatScreen
