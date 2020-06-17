import {inject, observer} from 'mobx-react'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {NAVIGATION_STORE, POST_IMAGE_SIZE} from '../../../constants'
import AttachedLocation from '../../ui/attachments/attached-location'
import Attachments from '../../ui/attachments'
import LinedSeparator from '../../ui/separator/lined-separator'
import PostControlRow from '../../post-control-row'
import {styles} from './styles'

@inject(NAVIGATION_STORE)
@observer
class PostCard extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        uid: PropTypes.string.isRequired,
        coords: PropTypes.object
    }

    handleHeaderPress = () => this.props.navigation.navigate('postScreen', {postId: this.props.uid})

    handleLocationPress = () => this.props.navigation.navigate('mapScreen', {coords: this.props.coords})

    render() {
        console.log('render post-card')
        const {title, text, location, uid, attachments} = this.props

        return (
            <View style={[styles.container]}>
                <TouchableOpacity onPress={this.handleHeaderPress}>
                    <View style={styles.row}>
                        <Text numberOfLines={1} style={styles.title}>
                            {title}
                        </Text>
                    </View>

                    <LinedSeparator />

                    <View style={styles.row}>
                        <Text numberOfLines={10} style={styles.text}>
                            {text}
                        </Text>
                    </View>
                </TouchableOpacity>

                {attachments && <Attachments maxSize={POST_IMAGE_SIZE} attachments={attachments} />}

                {location && (
                    <AttachedLocation
                        location={location}
                        style={{marginBottom: 8}}
                        onPress={this.handleLocationPress}
                    />
                )}

                <LinedSeparator />

                <PostControlRow postId={uid} />
            </View>
        )
    }
}

export default PostCard
