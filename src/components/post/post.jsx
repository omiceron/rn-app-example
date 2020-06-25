import {number, object, shape, string} from 'prop-types'
import React, {Component} from 'react'
import {SafeAreaView, StyleSheet, Text} from 'react-native'
import LinedSeparator from '../ui/separator/lined-separator'
import AttachedLocation from '../ui/attachments/attached-location'
import PostControlRow from '../post-control-row'
import PostInfo from './post-info'
import {BLACK_TEXT_COLOR, WHITE_BACKGROUND_COLOR} from '../../constants'
import BasicList from '../ui/grid/basic-list'

class Post extends Component {
    static propTypes = {
        title: string.isRequired,
        text: string.isRequired,
        coords: object,
        location: string,
        timestamp: number.isRequired,
        uid: string.isRequired,
        user: shape({
            firstName: string,
            lastName: string
        }).isRequired
    }

    renderSeparator = () => <LinedSeparator noMargins style={styles.separator} />

    render() {
        console.log('render post')

        const {location, title, text, coords, uid, user, timestamp, handleInfoPress, handleMapPress} = this.props

        // TODO: Attached location logic must be reordered
        return (
            <SafeAreaView style={styles.container}>
                <BasicList scrollable style={styles.content} separator={this.renderSeparator}>
                    <Text style={styles.title}>{title}</Text>
                    <PostInfo timestamp={timestamp} user={user} onPress={handleInfoPress} />
                    <Text style={styles.text}>{text}</Text>
                    {location && (
                        <AttachedLocation location={location} coords={coords} onPress={handleMapPress} showIcon />
                    )}
                    <PostControlRow postId={uid} />
                </BasicList>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: WHITE_BACKGROUND_COLOR
    },
    content: {
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    title: {
        fontSize: 32,
        fontWeight: '300',
        color: BLACK_TEXT_COLOR
    },
    text: {
        fontSize: 20,
        fontWeight: '200',
        color: BLACK_TEXT_COLOR
    },
    separator: {
        marginVertical: 8
    }
})

export default Post
