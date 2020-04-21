import React, {Component} from 'react'
import {Text, ActivityIndicator, StyleSheet, ScrollView, View} from 'react-native'
import {observable} from 'mobx'
import {observer, inject} from 'mobx-react'
import Avatar from '../common/touchable-avatar'
import PropTypes from 'prop-types'
import SegmentedCard from '../common/segmented-card'
import TableRow from '../common/table/table-row'
import TableBlock from '../common/table/table-block'
import {
    INACTIVE_BACKGROUND_COLOR,
    DEFAULT_HEADER_COLOR,
    FEED_STORE,
    HIGHLIGHTED_TEXT_COLOR,
    OFFLINE_COLOR,
    BLACK_TEXT_COLOR,
    WHITE_BACKGROUND_COLOR
} from '../../constants'
import {getDate, getTime} from '../../stores/utils'
import Table from '../common/table/table'
import List from '../common/list/list'

@inject(FEED_STORE)
@observer
class UserInfo extends Component {
    static propTypes = {
        user: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string,
            userInfo: PropTypes.string,
            email: PropTypes.string,
            avatar: PropTypes.string
        }),
        openChatWithUser: PropTypes.func.isRequired,
        openUserAvatarsScreen: PropTypes.func.isRequired,
        openPostScreen: PropTypes.func.isRequired
    }

    @observable likes = null
    @observable posts = null

    async componentDidMount() {
        this.likes = await this.props.feed.getUserLikedPosts(this.props.user.uid)
        this.posts = await this.props.feed.getUserPosts(this.props.user.uid)
    }

    renderAvatar = () => <Avatar size={60} onPress={this.props.openUserAvatarsScreen} uri={this.props.user.avatar} />

    handleOpenPostScreen = (postId) => () => this.props.openPostScreen(postId)

    renderLoadingRow = () => (
        <TableRow>
            <ActivityIndicator />
        </TableRow>
    )

    renderPostsList = ({items, emptyBlockTitle}) =>
        items.length ? (
            items.map(({postId, title}) => (
                <TableRow key={postId} title={title} onPress={this.handleOpenPostScreen(postId)} />
            ))
        ) : (
            <TableRow title={emptyBlockTitle} />
        )

    renderOnlineStatus = () => <Text style={[styles.text, styles.online]}>online</Text>

    renderLastSeenStatus = () => {
        const {online: timestamp} = this.props.user

        const date = getDate(timestamp, {short: true})
        const time = getTime(timestamp)

        return (
            <Text style={[styles.text, styles.offline]}>
                last seen {date} at {time}
            </Text>
        )
    }

    renderStatus = () =>
        typeof this.props.user.online === 'number' ? this.renderLastSeenStatus() : this.renderOnlineStatus()

    renderUserCard = () => {
        const {lastName, firstName, online} = this.props.user

        return (
            <SegmentedCard mainContainerStyle={styles.textView} LeftComponent={this.renderAvatar}>
                <View>
                    <Text style={styles.text}>
                        {firstName} {lastName}
                    </Text>
                </View>

                <View>{online && this.renderStatus()}</View>
            </SegmentedCard>
        )
    }

    render() {
        const {lastName, firstName, userInfo, email, avatar, uid, online} = this.props.user
        const {
            likes,
            posts,
            props: {openChatWithUser}
        } = this

        const sections = [
            {
                data: [
                    {
                        customComponent: this.renderUserCard,
                        name: 'user-card'
                    }
                ]
            },
            {
                data: [
                    {
                        name: 'user-info',
                        title: userInfo,
                        caption: 'User information'
                    },
                    {
                        name: 'user-email',
                        title: email,
                        caption: 'User e-mail'
                    }
                ]
            },
            {
                data: [
                    {
                        name: 'send-message-button',
                        title: 'Send message',
                        titleStyle: styles.blueButton,
                        onPress: openChatWithUser
                    }
                ]
            },
            {
                header: 'Liked posts',
                data: [
                    {
                        name: 'user-liked-posts',
                        customComponent: likes ? this.renderPostsList : this.renderLoadingRow,
                        props: {items: likes, emptyBlockTitle: 'User have not liked any posts'}
                    }
                ]
            },
            {
                header: 'User posts',
                data: [
                    {
                        name: 'user-posts',
                        customComponent: posts ? this.renderPostsList : this.renderLoadingRow,
                        props: {items: posts, emptyBlockTitle: 'User have no posts'}
                    }
                ]
            }
        ]

        return <List sections={sections} />
    }

    render2() {
        const {lastName, firstName, userInfo, email, avatar, uid, online} = this.props.user
        const {
            likes,
            posts,
            props: {openChatWithUser}
        } = this

        return (
            <Table scrollable>
                <TableBlock>
                    <SegmentedCard mainContainerStyle={styles.textView} LeftComponent={this.renderAvatar}>
                        <View>
                            <Text style={styles.text}>
                                {firstName} {lastName}
                            </Text>
                        </View>

                        <View>{online && this.renderStatus()}</View>
                    </SegmentedCard>
                </TableBlock>

                <TableBlock>
                    {userInfo && <TableRow title={userInfo} caption="user info" />}
                    {email && <TableRow title={email} caption="user e-mail" />}
                </TableBlock>

                <TableBlock>
                    <TableRow title="Send message" titleStyle={styles.blueButton} onPress={openChatWithUser} />
                </TableBlock>

                <TableBlock header="Liked posts" emptyBlockTitle="User have not liked any posts">
                    {likes ? this.renderPostsList(likes) : this.renderLoadingRow()}
                </TableBlock>

                <TableBlock header="User posts" emptyBlockTitle="User have no posts">
                    {posts ? this.renderPostsList(posts) : this.renderLoadingRow()}
                </TableBlock>
            </Table>
        )
    }
}

const styles = StyleSheet.create({
    simpleRow: {
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: WHITE_BACKGROUND_COLOR
    },
    separator: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: 35
    },
    online: {
        color: HIGHLIGHTED_TEXT_COLOR
    },
    offline: {
        color: OFFLINE_COLOR
    },
    avatar: {
        height: 70,
        width: 70,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 35
    },
    text: {
        fontSize: 16,
        fontWeight: '100',
        color: BLACK_TEXT_COLOR
    },
    imageView: {
        flex: 1,
        justifyContent: 'center',
        margin: 10
    },
    textView: {
        flex: 1,
        justifyContent: 'space-around',
        marginLeft: 10
    },
    blueButton: {
        color: DEFAULT_HEADER_COLOR,
        textAlign: 'center'
    }
})
export default UserInfo
