import {number, object, shape, string} from 'prop-types'
import React, {Component} from 'react'
import {SafeAreaView, ScrollView, Text, View} from 'react-native'
import LinedSeparator from '../ui/separator/lined-separator'
import AttachedLocation from '../ui/attachments/attached-location'
import AttachedMap from '../ui/attachments/attached-location/attached-map'
import PostControlRow from '../post-control-row'
import PostInfo from './post-info'
import {styles} from './styles'

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

    render() {
        console.log('render post')

        const {location, title, text, coords, uid, user, timestamp, handleInfoPress, handleMapPress} = this.props

        // TODO: Attached location logic must be reordered
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scroll}>
                    <View style={styles.row}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    <LinedSeparator noMargins />
                    <PostInfo timestamp={timestamp} user={user} onPress={handleInfoPress} />
                    <LinedSeparator noMargins />
                    <View style={styles.row}>
                        <Text style={styles.text}>{text}</Text>
                    </View>

                    {location && (
                        <AttachedLocation
                            location={location}
                            coords={coords}
                            onPress={handleMapPress}
                            style={{marginBottom: 8}}
                        />
                    )}

                    <LinedSeparator noMargins />
                    <PostControlRow postId={uid} />
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default Post
