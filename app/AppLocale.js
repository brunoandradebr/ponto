import React, { Component } from 'react'

import { AsyncStorage } from 'react-native';

export default class AppLocale {

    static async initialize() {

        // app locale
        this.locale = {
            'pt-BR': {
                ponto: {
                    balanceMessage: 'Um horário qualquer'
                },
                history: {
                },
                settings: {
                    text: 'Configurações'
                }
            },
            'en-NA': {
                ponto: {
                    balanceMessage: 'Any time'
                },
                history: {
                },
                settings: {
                    text: 'Settings'
                }
            }
        }

        // system info
        let systemLocation = await Expo.Localization.getLocalizationAsync()

        // default app locale
        location = this.locale['en-NA']

        // if system language has a locale object
        if (this.locale[systemLocation.locale])
            location = this.locale[systemLocation.locale]

        // save system language locale to storage
        await AsyncStorage.setItem('locale', JSON.stringify(location))
    }

    static async translate() {
        return JSON.parse(await AsyncStorage.getItem('locale'))
    }

}