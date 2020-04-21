import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

export const createTabBarIcon = (name) => ({tintColor, focused}) => (
    <Icon
        name={`ios-${name}`}
        // TODO: make custom font
        // <Icon name = {focused ? `ios-${name}` : `ios-${name}-outline`}
        size={30}
        style={{color: tintColor}}
    />
)
