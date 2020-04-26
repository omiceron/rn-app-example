import React, {Component} from 'react'
import {createIconSet} from '@expo/vector-icons'

export default class MeowChatIcon extends Component {
    render() {
        const CustomIcon = createIconSet({'cat-outline': '', cat: ''}, 'Meowchat')

        return <CustomIcon {...this.props} />
    }
}
