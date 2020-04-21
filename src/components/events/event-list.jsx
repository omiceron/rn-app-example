import React, { Component, PureComponent } from 'react'
import { Text, StyleSheet, SectionList, Animated, TouchableHighlight, View, PixelRatio } from 'react-native'
import EventCard from './event-card'
import { inject, observer } from 'mobx-react'
import { EVENTS_STORE } from '../../constants'
import LinedSeparator from '../common/separator/lined-separator'

const sectionsFixtures = 'abcdefghijklmnopqrstuvwxyz'.split('').map((letter) => ({
    title: letter,
    data: Array.from({ length: 3 }, (_, i) => ({
        key: letter + i,
        event: {
            title: letter + '_title_' + i,
            initials: 'AA',
            color: '#CCCCCC',
            where: letter + '_where_' + i
        }
    }))
}))

@inject(EVENTS_STORE)
@observer
class EventList extends Component {
    static propTypes = {}

    render() {
        const { onEventPress, events } = this.props

        return (
            <SectionList
                initialNumToRender={Number.MAX_SAFE_INTEGER}
                automaticallyAdjustContentInsets={false}
                ItemSeparatorComponent={LinedSeparator}
                style={styles.container}
                sections={events.sections}
                renderSectionHeader={({ section }) => <Text style={styles.header}>{section.title}</Text>}
                renderItem={({ item: { event } }) => (
                    <EventCard
                        onPress={onEventPress.bind(null, event)}
                        leftAction={onEventPress.bind(null, event)}
                        event={event}
                    />
                )}
            />
        )
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#FFF',
        color: '#999',
        padding: 8,
        fontSize: 16,
        fontWeight: '600'
    },
    /*  header: {
      //backgroundColor: '#F0F0F0',
      height: 40,
      lineHeight: 40,
      marginBottom: 5,
      shadowOffset: {
        height: 2, width: 0
      },
      shadowOpacity: 0.3,
      elevation: 3
    },*/
    firstLetter: {
        backgroundColor: '#F0F0F0',
        textAlign: 'center',
        padding: 5,
        fontSize: 20,
        fontFamily: 'HelveticaNeue-Bold'
    },
    item: {
        margin: 5,
        fontSize: 15,
        paddingLeft: 10,
        paddingRight: 10,
        fontFamily: 'HelveticaNeue-Light'
    },
    container: {
        backgroundColor: 'white'
    }
})

export default EventList
