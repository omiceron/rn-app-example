import React, {Component} from 'react'
import {inject, observer} from 'mobx-react'
import {Text, SectionList, StyleSheet} from 'react-native'
import PersonCard from './person-card'
import Separator from '../common/separator'
import Loader from '../common/loader'
import {PEOPLE_STORE} from '../../constants'
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
        onPress = {openChatScreen.bind(null, person)}
        getPhoto = {getPhoto.bind(null, key)}
        openUserInfoScreen = {openUserInfoScreen.bind(null, person)}
        person = {person}
      />

    return <SectionList
      sections = {sections}
      ItemSeparatorComponent = {ItemSeparatorComponent}
      SectionSeparatorComponent = {SectionSeparatorComponent}
      renderSectionHeader = {renderSectionHeader}
      renderItem = {renderItem}
      // automaticallyAdjustContentInsets = {false}
      style = {styles.container}
    />
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF'
  },
  header: {
    backgroundColor: '#FFF',
    color: '#999',
    padding: 8,
    fontSize: 16,
    fontWeight: '600'
  }

})

export default PeopleList