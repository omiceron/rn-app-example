import {computed, reaction} from 'mobx'
import {inject, observer} from 'mobx-react'
import {array, func, number, shape, string} from 'prop-types'
import React, {Component} from 'react'
import {LayoutAnimation} from 'react-native'
import {FEED_STORE, KEYBOARD, NAVIGATION_STORE} from '../../constants'
import Form from '../ui/form/form'
import FormAttachments from '../ui/form/form-attachments'
import FormInputs from '../ui/form/form-inputs'
import LinedSeparator from '../ui/separator/lined-separator'
import withAnimation from '../ui/with-animation'
import PostFormControlRow from './post-form-control-row'
import {styles} from './styles'

@withAnimation(KEYBOARD)
@inject(NAVIGATION_STORE)
@inject(FEED_STORE)
@observer
class PostForm extends Component {
    static propTypes = {
        // layouts: objectOf(objectOf(number)).isRequired,
        // getAttachmentsHelper: func.isRequired,
        feed: shape({
            coords: shape({
                latitude: number.isRequired,
                longitude: number.isRequired
            }),
            attachedCoords: shape({
                latitude: number.isRequired,
                longitude: number.isRequired
            }),
            title: string.isRequired,
            text: string.isRequired,
            setTitle: func.isRequired,
            setText: func.isRequired,
            clearPostForm: func.isRequired,
            attachments: array
        })
    }

    constructor(...args) {
        super(...args)

        reaction(
            () => this.props.layouts[KEYBOARD],
            () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        )

        this.stopReactionOnAttachments = reaction(
            () => this.attachedImages.length,
            () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        )
    }

    componentWillUnmount() {
        this.stopReactionOnAttachments()
        this.props.feed.clearPostForm()
        this.props.feed.deleteAttachments()
    }

    @computed
    get attachedImages() {
        return this.props.feed.getTempAttachments()
    }

    render() {
        const {
            feed: {attachedLocation, attachImageHandler, attachPhotoHandler, title, text, setTitle, setText},
            layouts: {
                [KEYBOARD]: {height}
            }
        } = this.props

        const formData = [
            {
                name: 'new-post-title',
                placeholder: 'Enter title here...',
                value: title,
                onChangeText: setTitle
            },
            {
                name: 'new-post-text',
                placeholder: 'Enter text here...',
                value: text,
                onChangeText: setText,
                multiline: true,
                stretch: true
            }
        ]

        // FIXME: attached images render only once
        return (
            <Form keyboardHeight={height} style={styles.container}>
                <FormInputs data={formData} autoFocusIndex={0} />

                <LinedSeparator noMargins />

                <FormAttachments images={this.attachedImages} location={attachedLocation} />

                {this.attachedImages.length || attachedLocation ? <LinedSeparator noMargins /> : null}

                <PostFormControlRow attachImageHandler={attachImageHandler} attachPhotoHandler={attachPhotoHandler} />
            </Form>
        )
    }
}

export default PostForm
