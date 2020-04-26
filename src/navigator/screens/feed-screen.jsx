import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import Feed from '../../components/feed'
import {FEED_STORE} from '../../constants'
import Loader from '../../components/ui/loader'
import NavigationButton from '../../components/navigation/navigation-button'
import PropTypes from 'prop-types'
import {DEFAULT_HEADER_COLOR} from '../../constants'
import EmptyList from '../../components/ui/empty-list'

@inject(FEED_STORE)
@observer
class FeedScreen extends Component {
    static propTypes = {
        feed: PropTypes.shape({
            posts: PropTypes.array.isRequired,
            loading: PropTypes.bool.isRequired
        })
    }

    static navigationOptions = ({navigation}) => {
        return {
            title: 'Feed',
            headerRight: () => <NavigationButton icon="ios-add" onPress={() => navigation.navigate('postForm')} />
        }
    }

    render() {
        const {posts, loading, loaded} = this.props.feed

        if (!posts.length && (!loaded || loading)) return <Loader />
        if (!posts.length) return <EmptyList title={'There are no posts yet...'} />

        return <Feed />
    }
}

export default FeedScreen
