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

  render() {
    const {
      getPhoto,
      openChatScreen,
      openUserInfoScreen,
      people: {
        sections
      }
    } = this.props

    const renderSectionHeader = ({section}) =>
      <Text style = {styles.header}>
        {section.title}
      </Text>

    const SectionSeparatorComponent = ({trailingItem, trailingSection}) =>
      trailingSection && !trailingItem ? <Separator topIndent = {8}/> : null

    const ItemSeparatorComponent = () => <Separator leftIndent = {48}/>

    const renderItem = ({item: {person, key}}) =>
      <PersonCard
        onPress = {openChatScreen.bind(null, person.uid)}
        getPhoto = {getPhoto.bind(null, key)}
        openUserInfoScreen = {openUserInfoScreen.bind(null, person.uid)}
        person = {person}
      />

    return <SafeAreaView style = {styles.container}>
      <SectionList
        sections = {sections}
        contentContainerStyle = {{backgroundColor: WHITE_BACKGROUND_COLOR}}
        ItemSeparatorComponent = {ItemSeparatorComponent}
        SectionSeparatorComponent = {SectionSeparatorComponent}
        renderSectionHeader = {renderSectionHeader}
        renderItem = {renderItem}
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