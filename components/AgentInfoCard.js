import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { PositionInformationFutures } from '../BinanceAccountController'

const binanceIcon = require('../assets/exchange-logos/Binance_Icon.png')

const AgentInfoCard = ({ name, exchange, position, onPress, apiKey, apiSecret }) => {
    const positionColor = position == 'hold' ? 'grey' : position == 'BUY' ? 'green' : 'red'
    const entryPriceColor = position == 'hold' ? 'grey' : 'white'
    const image = exchange == 'binance' ? binanceIcon : null
    const entryPrice = position == 'hold' ? 'NONE' : ''
    const [positionData, setPositionData] = useState([])

    useLayoutEffect(() => {
        async function GetData() {
            await PositionInformationFutures(apiKey, apiSecret)
                .then((data) => {
                    const asset = data.find(x => x.symbol == 'BTCUSDT')
                    setPositionData(asset)
                })
        }

        GetData()
    }, [])

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button}>
                <View style={styles.firstHalfInfoWrapper}>
                    <View style={styles.logoAndNameWrapper}>
                        <Image style={styles.image} source={image} />
                        <Text style={styles.agentNameText}>{name}</Text>
                    </View>
                    <Text style={styles.infoText}>Position: <Text style={[
                        styles.infoText,
                        { color: positionColor }
                    ]}>{position.toUpperCase()}</Text></Text>
                    <Text style={styles.infoText}>Entry price: <Text style={[
                        styles.infoText,
                        { color: entryPriceColor }
                    ]}></Text>{entryPrice}</Text>
                </View>
                <View style={styles.secondHalfInfoWrapper}>
                    <Text>2%</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export default AgentInfoCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    button: {
        width: '90%',
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        flexDirection: 'row'
    },
    image: {
        width: 40,
        height: 40
    },
    firstHalfInfoWrapper: {
        marginLeft: '5%',
        marginTop: '3%',
        marginBottom: '5%'
    },
    logoAndNameWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: '5%'
    },
    agentNameText: {
        fontSize: 40,
        fontWeight: '600',
        marginLeft: 10,
        color: 'white'
    },
    infoText: {
        color: 'grey',
        fontSize: 20,
        marginBottom: 5
    }
})