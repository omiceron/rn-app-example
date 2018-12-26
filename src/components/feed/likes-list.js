import React, {Component} from 'react'
import {StyleSheet, FlatList} from 'react-native'
import {array, string, func, shape, objectOf, number} from 'prop-types'
import PersonCard from '../people/person-card'
import Separator from '../common/separator'

class LikesList extends Component {
  static propTypes = {
    openUserInfoScreen: func.isRequired,
    likes: array.isRequired
  }

  renderLike = ({item}) => {
    return <PersonCard
      onPress = {this.props.openUserInfoScreen.bind(null, item.user)}
      person = {item.user}
    />
  }

  render() {
    return <FlatList
      ItemSeparatorComponent = {() => <Separator leftIndent = {48}/>}
      style = {styles.container}
      data = {this.props.likes}
      renderItem = {this.renderLike}
    />
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
  },
})

export default LikesList