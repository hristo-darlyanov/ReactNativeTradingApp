import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconMaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import { CandlestickChart } from 'react-native-wagmi-charts';
import { LineChart } from 'react-native-wagmi-charts';
import { GetKlines } from '../../BinanceAccountController';

const AgentInfoScreen = ({ route, navigation }) => {
    const [candleData, setCandleData] = useState([])
    const [lineData, setLineData] = useState([{ x: 0, value: 0 }])
    const [chart, setChart] = useState('line')
    const [lineChartButtonProps, setLineChartButtonProps] = useState({ borderColor: '#3e3e3e', backgroundColor: '#3e3e3e' })
    const [lineChartIconColor, setLineChartIconColor] = useState('grey')
    const [candleChartButtonProps, setCandleChartButtonProps] = useState({ borderColor: 'grey', backgroundColor: 'grey' })
    const [candleChartIconColor, setCandleChartIconColor] = useState('#2e2e2e')

    function CandlestickChartDisplay() {
        return (
            <CandlestickChart.Provider data={candleData}>
                <CandlestickChart height={360}>
                    <CandlestickChart.Candles />
                    <CandlestickChart.Crosshair>
                        <CandlestickChart.Tooltip />
                    </CandlestickChart.Crosshair>
                </CandlestickChart>
            </CandlestickChart.Provider>
        )
    }

    function LineChartDisplay() {
        return (
            <LineChart.Provider data={lineData}>
                <LineChart height={360}>
                    <LineChart.Path color='white' />
                </LineChart>
            </LineChart.Provider>
        )
    }

    useEffect(() => {
        if (chart == 'candlesticks') {
            setCandleChartButtonProps({ borderColor: '#3e3e3e', backgroundColor: '#3e3e3e' })
            setCandleChartIconColor('grey')
            setLineChartButtonProps({ borderColor: 'grey', backgroundColor: 'grey' })
            setLineChartIconColor('#2e2e2e')
        } else if (chart == 'line') {
            setLineChartButtonProps({ borderColor: '#3e3e3e', backgroundColor: '#3e3e3e' })
            setLineChartIconColor('grey')
            setCandleChartButtonProps({ borderColor: 'grey', backgroundColor: 'grey' })
            setCandleChartIconColor('#2e2e2e')
        }
    }, [chart])

    useLayoutEffect(() => {
        async function GetKlinesData() {
            await GetKlines()
                .then((data) => {
                    let tempCandleChartData = data.map(x => ({
                        timestamp: x[6],
                        open: x[1],
                        high: x[2],
                        low: x[3],
                        close: x[4]
                    }))
                    let tempLineChartData = data.map(x => ({
                        timestamp: x[6],
                        value: parseFloat(x[4])
                    }))
                    setCandleData(tempCandleChartData)
                    setLineData(tempLineChartData)
                })
                .catch(error => {
                    console.log(error)
                })
        }

        GetKlinesData()
    }, [])

    return (
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
            <View style={styles.chartGrid}></View>
            <View style={styles.chartContainer}>
                <View style={styles.chartHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ marginRight: 20 }}>
                            <Text style={styles.assetText}>BTCUSDT</Text>
                            <Text style={{ color: 'grey' }}>Perpetual</Text>
                        </View>
                        <Text style={{ fontSize: 30, color: 'white' }}>{candleData.length > 0 ? candleData[candleData.length - 1].close : ''}</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={[styles.swithToLineButton, { ...lineChartButtonProps }]} onPress={() => {
                            setChart('line')
                        }}>
                            <IconMaterialIcons
                                name="show-chart"
                                size={40}
                                color={lineChartIconColor}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.swithToCandlesButton, { ...candleChartButtonProps }]} onPress={() => {
                            setChart('candlesticks')
                        }}>
                            <IconMaterialIcons
                                name="waterfall-chart"
                                size={40}
                                color={candleChartIconColor}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {chart == 'candlesticks' ? <CandlestickChartDisplay /> : chart == 'line' ? <LineChartDisplay /> : <View></View>}
            </View>
            <View style={styles.chartGrid}></View>
        </View>
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
    chartContainer: {
        backgroundColor: '#1e1e1e',
    },
    chartGrid: {
        height: 1,
        backgroundColor: 'grey',
        width: '100%'
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5
    },
    assetText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    swithToLineButton: {
        borderWidth: 2,
        width: 70,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    swithChartText: {
        fontSize: 18
    },
    swithToCandlesButton: {
        borderWidth: 2,
        width: 70,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
})