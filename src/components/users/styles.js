import {StyleSheet} from 'react-native'
import {INACTIVE_BACKGROUND_COLOR, INACTIVE_TEXT_COLOR, WHITE_BACKGROUND_COLOR} from '../../constants'

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: INACTIVE_BACKGROUND_COLOR
    },
    header: {
        backgroundColor: WHITE_BACKGROUND_COLOR,
        color: INACTIVE_TEXT_COLOR,
        padding: 8,
        fontSize: 16,
        fontWeight: '600'
    },
    sectionSeparator: {
        marginTop: 8
    },
    itemSeparator: {
        marginLeft: 48
    }
})
