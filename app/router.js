import React from 'react';
import { Platform } from 'react-native'

// navigation
import { createNavigationContainer, createMaterialTopTabNavigator } from 'react-navigation'

// icons
import Icon from 'react-native-vector-icons/Feather'
import IconAwesome from 'react-native-vector-icons/FontAwesome'

// screens
import Historico from './screen/historico'
import Ponto from './screen/ponto'
import Configuracoes from './screen/configuracoes'

// app colors
import Color from './color.json'

// historico navigation definitions
const HistoricoDefinition = {
    screen: Historico,
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

// configuracoes navigation definitions
const ConfiguracoesDefinition = {
    screen: Configuracoes,
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
        Historico: HistoricoDefinition,
        Ponto: PontoDefinition,
        Configuracoes: ConfiguracoesDefinition
    },
    tabDefinition
)

// create navigation container and exports
export default MainNavigation = createNavigationContainer(tabNavigation)