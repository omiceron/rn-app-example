import {StyleSheet} from 'react-native'
import {OFFLINE_COLOR} from '../../constants'

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    iconContainer: {
        marginRight: 4,
        height: 24,
        width: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContainer: {
        flex: 1
    },
    text: {
        color: OFFLINE_COLOR,
        fontSize: 16,
        fontWeight: '100'
    }
})
