import {StyleSheet} from 'react-native'
import {BLACK_TEXT_COLOR, INACTIVE_TEXT_COLOR} from '../../constants'

export const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scroll: {
        marginHorizontal: 15
    },
    row: {
        marginVertical: 8
    },
    postInfoContainer: {
        marginVertical: 4,
        flexDirection: 'row'
    },
    date: {
        flex: 1,
        justifyContent: 'center'
    },
    author: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    authorButton: {
        flex: 1
    },
    authorName: {
        flex: 1,
        alignItems: 'flex-end'
    },
    title: {
        fontSize: 32,
        fontWeight: '300',
        color: BLACK_TEXT_COLOR
    },
    text: {
        fontSize: 20,
        fontWeight: '200',
        color: BLACK_TEXT_COLOR
    },
    name: {
        fontWeight: '500'
    },
    caption: {
        fontSize: 12,
        fontWeight: '100',
        color: INACTIVE_TEXT_COLOR
    },
    avatar: {
        marginLeft: 3
    }
})
