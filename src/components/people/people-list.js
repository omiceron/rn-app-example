import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Text, SectionList, StyleSheet, SafeAreaView} from 'react-native'
import PersonCard from './person-card'
import Separator from '../common/separator'
import Loader from '../common/loader'
import {INACTIVE_BACKGROUND_COLOR, PEOPLE_STORE, INACTIVE_TEXT_COLOR, WHITE_BACKGROUND_COLOR} from '../../constants'
import {shape, bool, func, array} from 'prop-types'

@inject(PEOPLE_STORE)
@observer
class PeopleList extends Component {
  static propTypes = {
    people: shape({
      sections: array.isRequired
    }),
    getPhoto: func,
    openChatScreen: func.isRequired,
    openUserInfoScreen: func.isRequired
  }

  renderSectionHeader = ({section}) =>
    <Text style = {styles.header}>
      {section.title}
    </Text>

  renderItem = ({item: {user, key}}) => {
    const {getPhoto, openChatScreen, openUserInfoScreen} = this.props

    return <PersonCard
      onPress = {openChatScreen.bind(null, user.uid)}
      getPhoto = {getPhoto.bind(null, user.uid)}
      openUserInfoScreen = {openUserInfoScreen.bind(null, user.uid)}
      user = {user}
    />
  }

  render() {
    console.log('PEOPLE LIST:', 'render')

    const {people} = this.props
    const SectionSeparatorComponent = ({trailingItem, trailingSection}) =>
      trailingSection && !trailingItem ? <Separator topIndent = {8}/> : null

    const ItemSeparatorComponent = () => <Separator leftIndent = {48}/>

    return <SafeAreaView style = {styles.container}>
      <SectionList
        sections = {people.sections}
        contentContainerStyle = {{backgroundColor: WHITE_BACKGROUND_COLOR}}
        ItemSeparatorComponent = {ItemSeparatorComponent}
        SectionSeparatorComponent = {SectionSeparatorComponent}
        renderSectionHeader = {this.renderSectionHeader}
        renderItem = {this.renderItem}
        initialNumToRender = {Number.MAX_SAFE_INTEGER}
        // automaticallyAdjustContentInsets = {false}
      />
    </SafeAreaView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: INACTIVE_BACKGROUND_COLOR
  },
  header: {
    backgroundColor: WHITE_BACKGROUND_COLOR,
    color: INACTIVE_TEXT_COLOR,
    padding: 8,
    fontSize: 16,
    fontWeight: '600'
  }

})

export default PeopleList