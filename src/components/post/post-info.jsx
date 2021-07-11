import React from 'react'
import {observer} from 'mobx-react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {getDate} from '../../stores/utils'
import {getFullName, translate} from '../utils'
import PostAvatar from './post-avatar'
import {INACTIVE_TEXT_COLOR} from '../../constants'

const PostInfo = (props) => {
    const {timestamp, user, onPress} = props

    console.log('render post-info')
    return (
        <View style={styles.container}>
            <View style={styles.date}>
                <Text style={styles.caption}>{getDate(timestamp)}</Text>
            </View>
            <TouchableOpacity style={styles.authorButton} onPress={onPress}>
                <View style={styles.author}>
                    <View style={styles.authorName}>
                        <Text style={styles.caption} numberOfLines={1}>
                            {`${translate('post.by')} `}
                            <Text style={styles.name}>{getFullName(user)}</Text>
                        </Text>
                    </View>
                    <PostAvatar uri={user.avatar} />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    date: {
        flex: 1,
        justifyContent: 'center'
    },
    author: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    authorButton: {
        flex: 1
    },
    authorName: {
        flex: 1,
        alignItems: 'flex-end'
    },
    name: {
        fontWeight: '500'
    },
    caption: {
        fontSize: 12,
        fontWeight: '100',
        color: INACTIVE_TEXT_COLOR
    }
})

export default observer(PostInfo)
