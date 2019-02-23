import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {FEED_STORE} from '../../constants/index'
import PostForm from '../feed/post-form'
import NavigationButton from '../navigation/navigation-button'

@inject(FEED_STORE)
@observer
class PostFormScreen extends Component {
  static navigationOptions = ({navigation}) => {
    const sendPost = navigation.getParam('sendPost')

    return ({
      title: 'Add post',
      headerLeft: <NavigationButton title = 'Cancel' onPress = {() => navigation.navigate('feed')}/>,
      headerRight: <NavigationButton title = 'Send' onPress = {sendPost}/>
    })
  }

  componentWillMount() {
    const {sendPost} = this.props.feed
    this.props.navigation.setParams({sendPost})
  }

  render() {
    return <PostForm/>
  }

}

export default PostFormScreen