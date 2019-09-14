import React, {Component} from 'react'
import { StyleSheet, FlatList, SafeAreaView, View } from 'react-native'
import {array, string, func, shape, objectOf, number} from 'prop-types'
import PersonCard from '../people/person-card'
import {INACTIVE_BACKGROUND_COLOR, WHITE_BACKGROUND_COLOR} from '../../constants'
import LinedSeparator from '../common/separator/lined-separator'

class LikesList extends Component {
  static propTypes = {
    openUserInfoScreen: func.isRequired,
    likes: array.isRequired
  }

  renderLike = ({item}) => {
    return <PersonCard
      onPress = {this.props.openUserInfoScreen.bind(null, item.user.uid)}
      user = {item.user}
    />
  }

  render() {
    return <SafeAreaView style = {styles.container}>
    <FlatList
      contentContainerStyle = {{backgroundColor: WHITE_BACKGROUND_COLOR}}
      ItemSeparatorComponent = {() => <LinedSeparator style = {styles.separator}/>}
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
  separator: {
    marginLeft: 48,
  }
})

export default LikesList
