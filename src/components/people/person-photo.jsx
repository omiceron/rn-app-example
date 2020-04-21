import React, {Component} from 'react'
import {View, StyleSheet, Modal, ActivityIndicator, Image} from 'react-native'
import Photo from '../common/photo'
import {observer, inject} from 'mobx-react'
import {observable, action} from 'mobx'
import {PEOPLE_STORE} from '../../constants'
import PropTypes from 'prop-types'

@inject(PEOPLE_STORE)
@observer
class PersonPhoto extends Component {
    static propTypes = {
        userId: PropTypes.string.isRequired
    }

    @observable uri = null
    @action setUri = (uri) => (this.uri = uri)

    renderPreview() {
        return (
            <View style={styles.container}>
                <Image style={styles.preview} source={{uri: this.uri}} />
                <Modal transparent key="loader">
                    <View style={styles.modal}>
                        <ActivityIndicator size="large" />
                    </View>
                </Modal>
            </View>
        )
    }

    render() {
        if (this.uri) return this.renderPreview()

        return <Photo photoHandler={this.getPhoto.bind(this)} />
    }

    async getPhoto({uri}) {
        const {userId, people} = this.props

        this.setUri(uri)

        await people.takePhoto(userId, uri)

        // navigation.goBack()
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    preview: {
        width: '100%',
        height: '100%'
    },
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)'
    }
})

export default PersonPhoto
