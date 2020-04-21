import React, { Component } from 'react'
import Photo from '../common/photo'
import { inject } from 'mobx-react'
import { AVATAR_STORE, WARNING_COLOR } from '../../constants'
import PropTypes from 'prop-types'
import * as MediaLibrary from 'expo-media-library'
import * as ImagePicker from 'expo-image-picker'
import { observable, action, toJS } from 'mobx'
import { observer } from 'mobx-react'
import { SafeAreaView, View, Image, FlatList } from 'react-native'

@inject(AVATAR_STORE)
@observer
class UserPhotoScreen extends Component {
    static propTypes = {
        avatar: PropTypes.shape({
            takePhoto: PropTypes.func.isRequired
        })
    }

    static navigationOptions = ({ navigation }) => ({
        headerShown: false,
        headerStyle: {
            backgroundColor: WARNING_COLOR
        }
    })

    // componentDidMount() {
    //   ImagePicker.launchImageLibraryAsync()
    // }

    render() {
        return <Photo photoHandler={this.props.avatar.takePhoto} />
    }
}

export default UserPhotoScreen
