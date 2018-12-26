import React from 'react'
import {StyleSheet, View} from 'react-native'
import BasicAvatar from '../common/basic-avatar'
import {HeaderTitle} from 'react-navigation'

const newHeaderTitle = ({user, ...rest}) =>
  <View style = {{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
    // backgroundColor: 'red'

  }}>
    <BasicAvatar style = {styles.avatar}/>
    <HeaderTitle {...rest}>{user.firstName}</HeaderTitle>
  </View>

const styles = StyleSheet.create({
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15
  }
})

export default newHeaderTitle