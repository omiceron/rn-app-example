import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {observer, inject} from 'mobx-react'
import LikesList from '../../components/likes-list'
import {observable} from 'mobx'
import Loader from '../../components/ui/loader'
import {FEED_STORE} from '../../constants'

@inject(FEED_STORE)
@observer
class LikesListScreen extends Component {
    static propTypes = {
        feed: PropTypes.shape({
            attachLocation: PropTypes.func.isRequired,
            getPostLikes: PropTypes.func.isRequired
        }),
        navigation: PropTypes.shape({
            state: PropTypes.shape({
                params: PropTypes.shape({
                    postId: PropTypes.string.isRequired
                })
            })
        })
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Likes'
        }
    }

    @observable likes = null

    async componentDidMount() {
        const {navigation, feed} = this.props
        this.likes = await feed.getPostLikes(navigation.state.params.postId)

        // TODO: ?
        // const {attachLocation} = feed
        // navigation.state.setParams({attachLocation})
    }

    render() {
        if (!this.likes) return <Loader />

        return <LikesList openUserInfoScreen={this.openUserInfoScreen} likes={this.likes} />
    }

    openUserInfoScreen = (userId) => {
        this.props.navigation.push('userScreen', {userId})
    }
}

export default LikesListScreen
