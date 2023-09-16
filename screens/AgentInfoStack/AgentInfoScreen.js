import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { CandlestickChart } from 'react-native-wagmi-charts';
import { GetKlines } from '../../BinanceAccountController';

const a = [
    {
        timestamp: 1625945400000,
        open: 33575.25,
        high: 33600.52,
        low: 33475.12,
        close: 33520.11,
    },
    {
        timestamp: 1625946300000,
        open: 33545.25,
        high: 33560.52,
        low: 33510.12,
        close: 33520.11,
    },
    {
        timestamp: 1625947200000,
        open: 33510.25,
        high: 33515.52,
        low: 33250.12,
        close: 33250.11,
    },
    {
        timestamp: 1625948100000,
        open: 33215.25,
        high: 33430.52,
        low: 33215.12,
        close: 33420.11,
    },
];

const AgentInfoScreen = ({ route, navigation }) => {
    const [candleData, setCandleData] = useState([])

    useLayoutEffect(() => {
        async function GetKlinesData() {
            await GetKlines()
            .then((data) => {
                result = data.map(x => ({
                    timestamp: x[6],
                    open: x[1],
                    high: x[2],
                    low: x[3],
                    close: x[4]
                }))
                setCandleData(result)
            })
        }

        GetKlinesData()
    })

    return (
        <CandlestickChart.Provider data={candleData}>
            <View style={styles.container}>
                <View
                    style={styles.backButton}>
                    <IconAntDesign.Button
                        name="left"
                        size={43}
                        backgroundColor={'black'}
                        color="grey"
                        onPress={() => navigation.navigate("MainStack", { screen: "AgentsDashboardScreen" })}
                        borderRadius={50}
                        iconStyle={{ marginRight: 5 }}
                        underlayColor="grey" />
                </View>
                <View>
                    <CandlestickChart>
                        <CandlestickChart.Candles />
                        <CandlestickChart.Crosshair>
                            <CandlestickChart.Tooltip />
                        </CandlestickChart.Crosshair>
                    </CandlestickChart>
                </View>
            </View>
        </CandlestickChart.Provider>
    )
}

export default AgentInfoScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    backButton: {
        marginTop: '10%',
        marginLeft: '3%',
        left: 0,
        top: 0,
        alignSelf: 'flex-start'
    },
})