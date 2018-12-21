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
                    balanceLabel: 'Saldo',
                    year: 'Ano',
                    month: 'Mês',
                    month0: 'Janeiro',
                    month1: 'Fevereiro',
                    month2: 'Março',
                    month3: 'Abril',
                    month4: 'Maio',
                    month5: 'Junho',
                    month6: 'Julho',
                    month7: 'Agosto',
                    month8: 'Setembro',
                    month9: 'Outubro',
                    month10: 'Novembro',
                    month11: 'Dezembro'
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
                    balanceLabel: 'Balance',
                    year: 'Year',
                    month: 'Month',
                    month0: 'January',
                    month1: 'February',
                    month2: 'March',
                    month3: 'April',
                    month4: 'May',
                    month5: 'June',
                    month6: 'July',
                    month7: 'August',
                    month8: 'September',
                    month9: 'October',
                    month10: 'November',
                    month11: 'December'
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