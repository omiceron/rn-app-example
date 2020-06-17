import {inject, observer} from 'mobx-react'
import {array, func, shape} from 'prop-types'
import React, {Component} from 'react'
import {SafeAreaView, SectionList, Text} from 'react-native'
import {USERS_STORE, WHITE_BACKGROUND_COLOR} from '../../constants'
import LinedSeparator from '../ui/separator/lined-separator'
import {styles} from './styles'
import UserItem from './user-item'

@inject(USERS_STORE)
@observer
class UsersList extends Component {
    static propTypes = {
        people: shape({
            sections: array.isRequired
        }),
        getPhoto: func,
        openChatScreen: func.isRequired,
        openUserInfoScreen: func.isRequired
    }

    renderSectionHeader = ({section}) => <Text style={styles.header}>{section.title}</Text>

    renderItem = ({item: {user, key}}) => {
        const {getPhoto, openChatScreen, openUserInfoScreen} = this.props

        return (
            <UserItem
                onPress={openChatScreen.bind(null, user.uid)}
                getPhoto={getPhoto.bind(null, user.uid)}
                openUserInfoScreen={openUserInfoScreen.bind(null, user.uid)}
                user={user}
            />
        )
    }

    render() {
        console.log('PEOPLE LIST:', 'render')

        const {people} = this.props
        const SectionSeparatorComponent = ({trailingItem, trailingSection}) =>
            trailingSection && !trailingItem ? <LinedSeparator style={styles.sectionSeparator} /> : null

        const ItemSeparatorComponent = () => <LinedSeparator style={styles.itemSeparator} />

        return (
            <SafeAreaView style={styles.container}>
                <SectionList
                    sections={people.sections}
                    contentContainerStyle={{backgroundColor: WHITE_BACKGROUND_COLOR}}
                    ItemSeparatorComponent={ItemSeparatorComponent}
                    SectionSeparatorComponent={SectionSeparatorComponent}
                    renderSectionHeader={this.renderSectionHeader}
                    renderItem={this.renderItem}
                    initialNumToRender={Number.MAX_SAFE_INTEGER}
                    // automaticallyAdjustContentInsets = {false}
                />
            </SafeAreaView>
        )
    }
}

export default UsersList
