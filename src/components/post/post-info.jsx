import React from 'react'
import {observer} from 'mobx-react'
import {Text, TouchableOpacity, View} from 'react-native'
import {getDate} from '../../stores/utils'
import {getFullName, translate} from '../utils'
import PostAvatar from './post-avatar'
import {styles} from './styles'

const PostInfo = (props) => {
    const {timestamp, user, onPress} = props

    console.log('render post-info')
    return (
        <View style={styles.postInfoContainer}>
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

export default observer(PostInfo)
