import React, { PureComponent } from 'react'
import { Text, StyleSheet, View, TouchableHighlight } from 'react-native'
import SwipeableCard from '../common/swipeable-card'
import Avatar from '../common/basic-avatar'

class EventCard extends PureComponent {
  static propTypes = {}

  renderAvatar = () => {
    return <Avatar size={60} /*uri = {avatar}*/ />
  }

  renderDate = () => {
    const {
      event: { when },
    } = this.props
    const timestamp = Date.parse(when)

    if (!timestamp) return null
    const date = new Date(timestamp)
      .toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      })
      .slice(0, 5)

    return (
      <Text numberOfLines={1} style={styles.text}>
        {date}
      </Text>
    )
  }

  render() {
    const {
      onPress,
      event: { title, where },
    } = this.props

    return (
      <SwipeableCard
        LeftComponent={this.renderAvatar}
        RightComponent={this.renderDate}
        onPress={onPress}
        onSwipeableLeftOpen={onPress}
        leftAction={onPress}
        rightActions={[
          { title: 'Info', color: '#C8C7CD', callback: onPress },
          { title: 'Delete', color: '#E67', callback: onPress },
        ]}
      >
        {/*        <View style = {styles.imageView}>
          <View style = {[styles.avatar, {backgroundColor: event.color}]}>
            <Text style = {{
              fontSize: 20,
              color: 'white',
              fontFamily: 'HelveticaNeue-Bold',
            }}>{event.initials}</Text>
          </View>
        </View>*/}

        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.text}>
          {where}
        </Text>
      </SwipeableCard>
    )
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'rgba(127,127,127,1)',
    fontSize: 16,
    // fontFamily: 'HelveticaNeue-Light',
    fontWeight: '100',
  },

  title: {
    marginBottom: 6,
    // fontFamily: 'HelveticaNeue-Bold',
    fontSize: 16,
    fontWeight: '600',
  },
})

export default EventCard
