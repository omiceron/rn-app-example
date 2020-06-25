import React from 'react'
import BasicAvatar from '../ui/basic-avatar'
import {StyleSheet} from 'react-native'

const PostAvatar = ({uri}) => {
    console.log('render avatar')
    return <BasicAvatar style={styles.avatar} size={20} uri={uri} />
}

const styles = StyleSheet.create({
    avatar: {
        marginLeft: 3
    }
})

export default PostAvatar
