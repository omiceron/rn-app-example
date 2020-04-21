import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {FEED_STORE} from '../../constants/index'
import PostForm from '../feed/post-form'
import NavigationButton from '../navigation/navigation-button'

@inject(FEED_STORE)
@observer
class PostFormScreen extends Component {
    constructor(...args) {
        super(...args)

        this.props.navigation.setParams({sendPost: this.props.feed.sendPost})
    }

    // TODO: send post clear attachments
    static navigationOptions = ({navigation}) => {
        const sendPost = navigation.getParam('sendPost')

        return {
            title: 'Add post',
            headerLeft: () => <NavigationButton title="Cancel" onPress={() => navigation.navigate('feed')} />,
            headerRight: () => <NavigationButton title="Send" onPress={sendPost} />
        }
    }

    render() {
        return <PostForm />
    }
}

export default PostFormScreen
