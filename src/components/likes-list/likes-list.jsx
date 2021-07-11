import {array, func} from 'prop-types'
import React, {Component} from 'react'
import {FlatList, SafeAreaView} from 'react-native'
import {WHITE_BACKGROUND_COLOR} from '../../constants'
import LinedSeparator from '../ui/separator/lined-separator'
import UserItem from '../users/user-item'
import {styles} from './styles'

class LikesList extends Component {
    static propTypes = {
        openUserInfoScreen: func.isRequired,
        likes: array.isRequired
    }

    renderLike = ({item}) => {
        return <UserItem onPress={this.props.openUserInfoScreen.bind(null, item.user.uid)} user={item.user} />
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <FlatList
                    contentContainerStyle={{backgroundColor: WHITE_BACKGROUND_COLOR}}
                    ItemSeparatorComponent={() => <LinedSeparator style={styles.separator} />}
                    data={this.props.likes}
                    renderItem={this.renderLike}
                />
            </SafeAreaView>
        )
    }
}

export default LikesList
