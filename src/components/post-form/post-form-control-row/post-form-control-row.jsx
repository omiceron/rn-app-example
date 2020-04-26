import {inject} from 'mobx-react'
import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {NAVIGATION_STORE} from '../../../constants'
import BasicRow from '../../ui/grid/basic-row'
import PostButton from './post-button'
import {styles} from './styles'

@inject(NAVIGATION_STORE)
class PostFormControlRow extends Component {
    static propTypes = {
        attachImageHandler: PropTypes.func,
        attachPhotoHandler: PropTypes.func
    }

    render() {
        return (
            <BasicRow style={styles.container}>
                <PostButton icon="ios-photos" onPress={this.props.attachImageHandler} />
                <PostButton icon="ios-pin" onPress={() => this.props.navigation.navigate('locationForm')} />
                <PostButton icon="ios-person" onPress={() => ({})} />
                <PostButton icon="ios-camera" onPress={this.props.attachPhotoHandler} />
            </BasicRow>
        )
    }
}

export default PostFormControlRow
