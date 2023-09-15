import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useLayoutEffect, useState, useContext } from 'react'
import { PositionInformationFutures } from '../BinanceAccountController'
import { LinearGradient } from 'expo-linear-gradient';
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { RefreshingAgentsTabContext } from './PublicContexts';

const binanceIcon = require('../assets/exchange-logos/Binance_Icon.png')

const AgentInfoCard = ({ name, exchange, position, onPress, apiKey, apiSecret }) => {
    const positionColor = position == 'hold' ? 'grey' : position == 'BUY' ? 'green' : 'red'
    const entryPriceColor = position == 'hold' ? 'grey' : 'white'
    const image = exchange == 'binance' ? binanceIcon : null
    const entryPrice = position == 'hold' ? 'NONE' : ''
    const { isRefreshing, setIsRefreshing } = useContext(RefreshingAgentsTabContext)
    const [profitColor, setProfitColor] = useState('#1e1e1e')
    const [positionData, setPositionData] = useState([])
    const [profitPercentage, setProfitPercentage] = useState('0')
    const [percentageIncreaseImage, setPercentageIncreaseImage] = useState('minus')

    useLayoutEffect(() => {
        async function GetData() {
            if (isRefreshing) {
                await PositionInformationFutures(apiKey, apiSecret)
                    .then((data) => {
                        const asset = data.find(x => x.symbol == 'BTCUSDT')
                        const tempProfitColor = asset.unRealizedProfit > 0 ? 'green' : asset.unRealizedProfit < 0 ? 'red' : '#1e1e1e'
                        let tempProfitPercentage = ((asset.markPrice - asset.entryPrice) / asset.entryPrice) * 100
                        if (position == 'SELL') {
                            tempProfitPercentage = -tempProfitPercentage
                        }
                        const tempPercentageIncreaseImage = tempProfitPercentage > 0 ? 'caretup' : tempProfitPercentage < 0 ? 'caretdown' : 'minus'
                        setProfitPercentage(tempProfitPercentage)
                        setPositionData(asset)
                        setProfitColor(tempProfitColor)
                        setPercentageIncreaseImage(tempPercentageIncreaseImage)
                        setIsRefreshing(false)
                    })
                    .catch(error => { console.log(error) })
            }
        }

        GetData()
    }, [isRefreshing])

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
                    ]}>{parseFloat(positionData.entryPrice).toFixed()}</Text>{entryPrice.toString()}</Text>
                    <Text style={styles.infoText}>Market price: <Text style={[
                        styles.infoText,
                        { color: 'white' }
                    ]}>{parseFloat(positionData.markPrice).toFixed().toString()}</Text></Text>
                </View>
                <View style={styles.secondHalfInfoWrapper}>
                    <LinearGradient
                        style={styles.linearGradient}
                        colors={[profitColor, profitColor, 'transparent']}
                        start={{ x: 1, y: 1 }}
                        end={{ x: 0.1, y: 0.9 }}
                        locations={[0, 0.4, 1]}>
                        <View style={styles.percentageIncreaseInfoWrapper}>
                            <Text style={styles.percentageIncreaseText}>{parseFloat(profitPercentage).toFixed(2).toString()}%</Text>
                            <IconAntDesign
                                name={percentageIncreaseImage}
                                size={20}
                                style={{ marginLeft: 5 }}
                                color="white" />
                        </View>
                        <Text style={styles.unrealizedProfitText}>( {parseFloat(positionData.unRealizedProfit).toFixed(2).toString()} USDT )</Text>
                    </LinearGradient>
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
        marginBottom: '3%'
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
        marginBottom: '6%'
    },
    linearGradient: {
        flex: 1,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    secondHalfInfoWrapper: {
        width: '100%',
        flex: 1
    },
    percentageIncreaseText: {
        color: 'white',
        fontSize: 35,
        fontWeight: '900'
    },
    percentageIncreaseInfoWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    unrealizedProfitText: {
        marginTop: 10,
        color: 'white',
        fontSize: 20
    }
})