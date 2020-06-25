import {inject, observer} from 'mobx-react'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {StyleSheet, Text, TouchableOpacity} from 'react-native'
import {
    BLACK_TEXT_COLOR,
    INACTIVE_TEXT_COLOR,
    NAVIGATION_STORE,
    POST_IMAGE_SIZE,
    WHITE_BACKGROUND_COLOR
} from '../../../constants'
import AttachedLocation from '../../ui/attachments/attached-location'
import Attachments from '../../ui/attachments'
import LinedSeparator from '../../ui/separator/lined-separator'
import PostControlRow from '../../post-control-row'
import BasicSeparator from '../../ui/separator/basic-separator'
import BasicList from '../../ui/grid/basic-list'

@inject(NAVIGATION_STORE)
@observer
class PostCard extends Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
        uid: PropTypes.string.isRequired,
        coords: PropTypes.object
    }

    handleCardPress = () => this.props.navigation.navigate('postScreen', {postId: this.props.uid})

    handleLocationPress = () => this.props.navigation.navigate('mapScreen', {coords: this.props.coords})

    renderSeparator = () => <LinedSeparator style={styles.separator} />

    render() {
        console.log('render post-card')
        const {title, text, location, uid, attachments} = this.props

        return (
            <TouchableOpacity style={styles.container} onPress={this.handleCardPress}>
                <BasicList separator={this.renderSeparator}>
                    <Text numberOfLines={1} style={styles.title}>
                        {title}
                    </Text>

                    <BasicList separator={BasicSeparator}>
                        <Text numberOfLines={10} style={styles.text}>
                            {text}
                        </Text>

                        {attachments && <Attachments maxSize={POST_IMAGE_SIZE} attachments={attachments} />}

                        {location && (
                            <AttachedLocation location={location} onPress={this.handleLocationPress} showIcon />
                        )}
                    </BasicList>

                    <PostControlRow postId={uid} />
                </BasicList>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: WHITE_BACKGROUND_COLOR,
        paddingHorizontal: 8,
        borderColor: 'rgba(192,192,192,0.5)',
        borderRadius: 6,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        padding: 8
    },
    text: {
        color: INACTIVE_TEXT_COLOR,
        fontSize: 16,
        fontWeight: '300'
    },
    title: {
        color: BLACK_TEXT_COLOR,
        fontSize: 16,
        fontWeight: '600'
    },
    separator: {
        marginVertical: 8
    }
})

export default PostCard
