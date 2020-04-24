import React, {Component} from 'react'
import SlideShow from '../../components/common/slide-show'
import {StatusBar} from 'react-native'
import {observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import Loader from '../../components/common/loader'
import {PEOPLE_STORE} from '../../constants'

@inject(PEOPLE_STORE)
@observer
class UserAvatarsScreen extends Component {
    static navigationOptions = ({navigation}) => ({
        headerShown: false
    })

    @observable user = null

    componentDidMount() {
        StatusBar.setHidden(true, 'fade')
    }

    async componentDidMount() {
        const {userId} = this.props.navigation.state.params

        this.user = await this.props.people.getUserGreedily(userId)
    }

    componentWillUnmount() {
        StatusBar.setHidden(false, 'fade')
    }

    render() {
        if (!this.user) return <Loader />

        return <SlideShow onPress={this.handlePress} uri={this.user.avatar} />
    }

    handlePress = () => {
        this.props.navigation.goBack()
        // StatusBar.setHidden(false, 'slide')
    }
}

export default UserAvatarsScreen
