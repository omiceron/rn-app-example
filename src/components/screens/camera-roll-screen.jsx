import React, {Component} from 'react'
import PropTypes from 'prop-types'
import * as MediaLibrary from 'expo-media-library'
import {observable, action, toJS} from 'mobx'
import {observer} from 'mobx-react'
import {SafeAreaView, View, Image, FlatList} from 'react-native'

const NUMBER_OF_COLUMNS = 6

@observer
class CameraRollScreen extends Component {
    static propTypes = {}

    @observable photos = null
    @action setPhotos = (photos) => {
        // if (photos.length % NUMBER_OF_COLUMNS) {
        //   const delta = NUMBER_OF_COLUMNS -
        // (photos.length - Math.floor(photos.length / NUMBER_OF_COLUMNS) * NUMBER_OF_COLUMNS)
        //   photos = [...photos, ...Array.from({length: delta}, () => ({isDummy: true}))]
        // }
        this.photos = photos
    }

    async componentDidMount() {
        const {assets} = await MediaLibrary.getAssetsAsync()
        const photos = await Promise.all(assets.map((asset) => MediaLibrary.getAssetInfoAsync(asset)))
        this.setPhotos(photos)
    }

    render() {
        if (!this.photos) return null

        return (
            <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
                <FlatList
                    horizontal={false}
                    numColumns={NUMBER_OF_COLUMNS}
                    keyExtractor={(item) => item.id}
                    data={toJS(this.photos)}
                    renderItem={({item}) => (
                        <View style={{width: 60, height: 60, justifyContent: 'center', alignItems: 'center'}}>
                            {!item.isDummy ? (
                                <Image style={{width: 50, height: 50}} source={{uri: item.localUri}} />
                            ) : null}
                        </View>
                    )}
                />
            </SafeAreaView>
        )
    }
}

export default CameraRollScreen
