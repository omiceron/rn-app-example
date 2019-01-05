import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'
import PropTypes from 'prop-types'
import {inject, observer} from 'mobx-react'
import {observable} from 'mobx'

@observer
class PostScreen extends Component {
  static propTypes = {}

  static navigationOptions = ({navigation}) => {
    return ({
      title: 'firstName',
      headerStyle: {
        backgroundColor: '#67E',
        borderBottomWidth: 0
      },
      headerTintColor: '#FFF'

    })
  }

  @observable post = null

  render() {
    console.log(this.props.navigation.state.params.postId)
    return <View>
    </View>
  }
}

const styles = StyleSheet.create({
  container: {},
})

export default PostScreen