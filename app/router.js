import React from 'react';
import { Platform } from 'react-native'

// navigation
import { createNavigationContainer, createMaterialTopTabNavigator } from 'react-navigation'

// icons
import Icon from '@expo/vector-icons/Feather'
import IconAwesome from '@expo/vector-icons/FontAwesome'

// screens
import History from './screen/history'
import Ponto from './screen/ponto'
import Settings from './screen/settings'

// app colors
import Color from './color.json'

// history navigation definitions
const HistoryDefinition = {
    screen: History,
    navigationOptions: ({ navigation }) => ({
        title: 'Histórico',
        tabBarIcon: ({ focused, tintColor }) => <Icon name={'calendar'} size={(Platform.OS === 'ios') ? 25 : 20} color={tintColor} />
    })
}

// ponto navigation definitions
const PontoDefinition = {
    screen: Ponto,
    navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused, tintColor }) => {
            let icon = focused ? 'circle' : 'circle-o'
            return <IconAwesome name={icon} size={(Platform.OS === 'ios') ? 25 : 20} color={tintColor} />;
        },
    })
}

// settings navigation definitions
const SettingsDefinition = {
    screen: Settings,
    navigationOptions: ({ navigation }) => ({
        title: 'Configurações',
        tabBarIcon: ({ focused, tintColor }) => <Icon name={'settings'} size={(Platform.OS === 'ios') ? 25 : 20} color={tintColor} />
    })
}

// tab bar definitions
const tabDefinition = {
    tabBarOptions: {
        activeTintColor: Color.accent,
        inactiveTintColor: Color.secondary,
        showIcon: true,
        upperCaseLabel: false,
        style: {
            backgroundColor: Color.primary2,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            height: 60,
        },
        indicatorStyle: {
            borderBottomWidth: 2,
            borderBottomColor: Color.primary2,
        }
    },
    initialRouteName: 'Ponto',
    tabBarPosition: 'bottom',
}

// create tab navigation
const tabNavigation = createMaterialTopTabNavigator(
    {
        History: HistoryDefinition,
        Ponto: PontoDefinition,
        Settings: SettingsDefinition
    },
    tabDefinition
)

// create navigation container and exports
export default MainNavigation = createNavigationContainer(tabNavigation)