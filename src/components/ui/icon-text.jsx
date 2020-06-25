import React, {Component} from 'react'
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import {OFFLINE_COLOR} from '../../constants'

interface TextProps {
    icon?: string;
    text: string;
    size?: number;
    style?: any;
    color?: string;
}

class IconText extends Component<TextProps> {
    static defaultProps = {
        size: 16,
        color: OFFLINE_COLOR
    }

    render() {
        const {size, text, icon, style, color} = this.props

        return (
            <View style={[styles.container, style]}>
                {icon && (
                    <View style={styles.iconContainer}>
                        <Icon size={size} color={color} name={icon} />
                    </View>
                )}

                <View style={styles.textContainer}>
                    <Text style={[styles.text, {color, fontSize: size}]} numberOfLines={1}>
                        {text}
                    </Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
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
        fontSize: 16,
        fontWeight: '300'
    }
})

export default IconText
