import React, {Component} from 'react'
import {Text, StyleSheet} from 'react-native'
import Card from '../ui/basic-card'
import Avatar from '../ui/basic-avatar'
import SwipeableCard from '../ui/swipeable-card'
import PropTypes from 'prop-types'
import {BLACK_TEXT_COLOR, ROW_HEIGHT} from '../../constants'
import SegmentedCard from '../ui/segmented-card'

class PersonCard extends Component {
    static propTypes = {
        user: PropTypes.shape({
            firstName: PropTypes.string.isRequired,
            lastName: PropTypes.string,
            avatar: PropTypes.string,
            email: PropTypes.string
        }),
        getPhoto: PropTypes.func,
        openUserInfoScreen: PropTypes.func
    }

    renderAvatar = () => {
        return <Avatar size={30} uri={this.props.user.avatar} />
    }

    render() {
        console.log('render person')
        const {firstName, lastName, email} = this.props.user
        const {getPhoto, openUserInfoScreen, ...rest} = this.props
        // console.log('render', firstName)

        const Card = openUserInfoScreen && getPhoto ? SwipeableCard : SegmentedCard

        const swipeableProps = {
            // onSwipeableLeftOpen: () => alert('open'),
            // leftAction: () => alert('open'),
            rightActionWidth: ROW_HEIGHT,
            rightActions: [
                // {title: 'Info', color: '#C8C7CD', callback: openUserInfoScreen},
                {title: 'Info', color: '#eadcc1', callback: openUserInfoScreen}
                // {title: 'Photo', color: '#FFAB00', callback: getPhoto}
            ]
        }

        return (
            <Card
                mainContainerStyle={styles.textContainer}
                LeftComponent={this.renderAvatar}
                {...rest}
                {...swipeableProps}
                // onSwipeableLeftOpen = {() => alert('open')}
                // leftAction = {() => alert('open')}
                // rightActionWidth = {ROW_HEIGHT}
                // rightActions = {[
                //   {title: 'Info', color: '#C8C7CD', callback: openUserInfoScreen},
                //   {title: 'Photo', color: '#FFAB00', callback: getPhoto},
                // ]}
            >
                <Text numberOfLines={1} style={styles.text}>
                    {firstName} {lastName}
                </Text>
            </Card>
        )
    }
}

const styles = StyleSheet.create({
    text: {
        color: BLACK_TEXT_COLOR,
        fontSize: 16,
        fontWeight: '100'
    },
    textContainer: {
        justifyContent: 'space-around'
    }
})

export default PersonCard
