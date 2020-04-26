import {StyleSheet} from 'react-native'
import {BLACK_TEXT_COLOR, INACTIVE_TEXT_COLOR, WHITE_BACKGROUND_COLOR} from '../../../constants'

export const styles = StyleSheet.create({
    container: {
        // flex: 1,
        display: 'flex',
        backgroundColor: WHITE_BACKGROUND_COLOR,
        paddingHorizontal: 8,
        borderColor: 'rgba(192,192,192,0.5)',
        // borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        shadowOffset: {
            width: 3,
            height: 3
        },
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        margin: 8
    },
    text: {
        color: INACTIVE_TEXT_COLOR,
        fontSize: 16,
        fontWeight: '100'
    },
    title: {
        color: BLACK_TEXT_COLOR,
        fontSize: 16,
        fontWeight: '600'
    },
    row: {
        marginVertical: 8
    }
})
