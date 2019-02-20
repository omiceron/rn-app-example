import React, {Component} from 'react'
import {StyleSheet, FlatList, SafeAreaView} from 'react-native'
import {array, string, func, shape, objectOf, number} from 'prop-types'
import PersonCard from '../people/person-card'
import Separator from '../common/separator'
import {INACTIVE_BACKGROUND_COLOR, WHITE_BACKGROUND_COLOR} from '../../constants'

class LikesList extends Component {
  static propTypes = {
    openUserInfoScreen: func.isRequired,
    likes: array.isRequired
  }

  renderLike = ({item}) => {
    return <PersonCard
      onPress = {this.props.openUserInfoScreen.bind(null, item.user.uid)}
      person = {item.user}
    />
  }

  render() {
    return <SafeAreaView style = {styles.container}>
    <FlatList
      contentContainerStyle = {{backgroundColor: WHITE_BACKGROUND_COLOR}}
      ItemSeparatorComponent = {() => <Separator leftIndent = {48}/>}
      data = {this.props.likes}
      renderItem = {this.renderLike}
    />
    </SafeAreaView>
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: INACTIVE_BACKGROUND_COLOR,
  },
})

export default LikesList