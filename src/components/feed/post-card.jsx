import React, {Component, PureComponent} from 'react'
import {Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated, Easing, Image} from 'react-native'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import {computed} from 'mobx'
import {FEED_STORE, HIT_SLOP} from '../../constants'
import {
    NAVIGATION_STORE,
    WHITE_BACKGROUND_COLOR,
    INACTIVE_TEXT_COLOR,
    BLACK_TEXT_COLOR,
    POST_IMAGE_SIZE
} from '../../constants'
import AttachedLocation from './attached-location'
import PostControlRow from '../post/post-control-row'
import Attachments from '../common/attachments'
import LinedSeparator from '../common/separator/lined-separator'

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

                <PostControlRow uid={uid} />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        display: 'flex',
        backgroundColor: WHITE_BACKGROUND_COLOR,
        paddingHorizontal: 8,
        borderColor: 'rgba(192,192,192,0.5)',
        // borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        margin: 8
    },
    text: {
        color: INACTIVE_TEXT_COLOR,
        fontSize: 16,
        fontWeight: '100'
    },
    title: {
        color: BLACK_TEXT_COLOR,
        fontSize: 16,
        fontWeight: '600'
    },
    row: {
        marginVertical: 8
    }
})

export default PostCard
