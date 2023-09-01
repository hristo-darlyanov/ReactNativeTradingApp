import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React from 'react'

const binanceIcon = require('../assets/exchange-logos/Binance_Icon.png')

const LinkedAccountInfoCard = ({ name, exchange, apiKey }) => {
    let image = null
    if (exchange == 'binance') {
        image = binanceIcon
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <Image style={styles.image} source={image}/>
                <View style={styles.textWrapper}>
                    <Text style={styles.nameText}>{name}</Text>
                    <Text style={styles.apiKeyText}>Api key: {apiKey.substring(0, 4)}XXXX</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default LinkedAccountInfoCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#1e1e1e',
        width: '90%',
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',
        padding: 15
    },
    nameText: {
        fontSize: 25,
        color: 'white',
        marginBottom: 7
    },
    apiKeyText: {
        color: 'grey',
        fontSize: 16
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 10
    },
    textWrapper: {
        flexDirection: 'column'
    }
})