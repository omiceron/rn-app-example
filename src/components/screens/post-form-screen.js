import React, {Component} from 'react'
import {observer, inject} from 'mobx-react'
import {FEED_STORE} from '../../constants/index'
import PostForm from '../feed/post-form'
import NavigationButton from '../navigation/navigation-button'

@inject(FEED_STORE)
@observer
class PostFormScreen extends Component {
  constructor(...args) {
    super(...args)

    const {sendPost} = this.props.feed
    const getAttachments = () => this.attachments
    this.props.navigation.setParams({sendPost, getAttachments})

  }

  static navigationOptions = ({navigation}) => {
    const sendPost = navigation.getParam('sendPost')
    const getAttachments = navigation.getParam('getAttachments')

    return ({
      title: 'Add post',
      headerLeft: <NavigationButton title = 'Cancel' onPress = {() => navigation.navigate('feed')}/>,
      headerRight: <NavigationButton title = 'Send' onPress = {() => sendPost(getAttachments())}/>
    })
  }

  getAttachmentsHelper = (attachments) => {
    this.attachments = attachments
  }

  render() {
    return <PostForm
      getAttachmentsHelper = {this.getAttachmentsHelper}
    />
  }

}

export default PostFormScreen