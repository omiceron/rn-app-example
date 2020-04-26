import React from 'react'
import BasicAvatar from '../ui/basic-avatar'
import {styles} from './styles'

const PostAvatar = ({uri}) => {
    console.log('render avatar')
    return <BasicAvatar style={styles.avatar} size={20} uri={uri} />
}

export default PostAvatar
