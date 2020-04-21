import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import PostButton from './post-button'
import { inject } from 'mobx-react'
import { NAVIGATION_STORE } from '../../constants'
import TableRow from '../common/table/table-row'
import BasicCard from '../common/basic-card'
import BasicList from '../common/grid/basic-list'
import BasicRow from '../common/grid/basic-row'

@inject(NAVIGATION_STORE)
class PostFormControlRow extends Component {
  static propTypes = {
    attachImageHandler: PropTypes.func,
    attachPhotoHandler: PropTypes.func,
  }

  render() {
    return (
      <BasicRow style={styles.container}>
        <PostButton icon="ios-photos" onPress={this.props.attachImageHandler} />
        <PostButton icon="ios-pin" onPress={() => this.props.navigation.navigate('locationForm')} />
        <PostButton icon="ios-person" onPress={() => ({})} />
        <PostButton icon="ios-camera" onPress={this.props.attachPhotoHandler} />
      </BasicRow>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: 'space-around',
  },
})

export default PostFormControlRow
