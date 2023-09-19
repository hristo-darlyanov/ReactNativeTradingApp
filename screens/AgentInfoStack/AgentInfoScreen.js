import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconMaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import { CandlestickChart } from 'react-native-wagmi-charts';
import { LineChart } from 'react-native-wagmi-charts';
import { GetKlines, OrdersInformationFutures } from '../../BinanceAccountController';

const AgentInfoScreen = ({ route, navigation }) => {
    const { entryPrice, apiKey, apiSecret, position } = route.params
    const [candleData, setCandleData] = useState([])
    const [lineData, setLineData] = useState([{ x: 0, value: 0 }])
    const [chart, setChart] = useState('line')
    const [lineChartButtonProps, setLineChartButtonProps] = useState({ borderColor: '#3e3e3e', backgroundColor: '#3e3e3e' })
    const [lineChartIconColor, setLineChartIconColor] = useState('grey')
    const [candleChartButtonProps, setCandleChartButtonProps] = useState({ borderColor: 'grey', backgroundColor: 'grey' })
    const [candleChartIconColor, setCandleChartIconColor] = useState('#2e2e2e')
    const [horizontalLineProps, setHorizontalLineProps] = useState({ at: { value: -1}, })
    const [lineHighlightProps, setLineHighlightProps] = useState({ color: 'gray'})
    const [dotProps, setDotProps] = useState({})
    const [orderData, setOrderData] = useState({})
    const positionColor = position == 'hold' ? 'grey' : position == 'BUY' ? '#33ff1c' : 'red'

    const formatUSD = value => {
        'worklet';
        if (value === '') {
            const formattedValue = `${parseFloat(candleData.length > 0 ? candleData[candleData.length - 1].close : '').toFixed(2)}`
            return `${formattedValue}`
        }

        const formattedValue = `${parseFloat(value).toFixed(2)}`
        return `${formattedValue}`
    }

    function CandlestickChartDisplay() {
        return (
            <CandlestickChart height={360}>
                <CandlestickChart.Candles />
                <CandlestickChart.Crosshair>
                    <CandlestickChart.Tooltip />
                </CandlestickChart.Crosshair>
            </CandlestickChart>
        )
    }

    function LineChartDisplay() {
        return (
            <LineChart height={360}>
                <LineChart.Path color='white' >
                    <LineChart.HorizontalLine {...horizontalLineProps} />
                    <LineChart.Dot {...dotProps}/>
                    <LineChart.Highlight {...lineHighlightProps}/>
                    <LineChart.Gradient color='white'/>
                </LineChart.Path>
            </LineChart>
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

    useEffect(() => {
        if (orderData != {} && lineData.length > 0) {
            let lineDataConvertedTimes = []
            const positionConvertedTimestamp = new Date(orderData.time)
            lineData.forEach(element => {
                lineDataConvertedTimes.push(new Date(element.timestamp))
            });
            const indexOfPosition = lineDataConvertedTimes.findIndex(x => x.getDate() == positionConvertedTimestamp.getDate())
            setDotProps({
                at: indexOfPosition,
                color: positionColor,
                size: 6,
                hasOuterDot: true,
                outerSize: 12
            })
            setLineHighlightProps({color: positionColor, from: indexOfPosition, to: 30})
            setHorizontalLineProps({at: {index: indexOfPosition}})
        }
    }, [orderData, lineData])

    useLayoutEffect(() => {
        async function GetOrdersData() {
            await OrdersInformationFutures(apiKey, apiSecret)
            .then((data) => {
                const order = data.find(x => parseFloat(x.avgPrice).toFixed(2) == entryPrice.toFixed(2))
                setOrderData(order)
            })
        }

        GetOrdersData()
    }, [])

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
        <LineChart.Provider data={lineData}>
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
                    <View style={styles.chartContainer}>
                        <View style={styles.chartHeader}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ marginRight: 20 }}>
                                    <Text style={styles.assetText}>BTCUSDT</Text>
                                    <Text style={{ color: 'grey' }}>Perpetual</Text>
                                </View>
                                {/* <Text style={{ fontSize: 30, color: 'white' }}>{candleData.length > 0 ? candleData[candleData.length - 1].close : ''}</Text> */}
                                <LineChart.PriceText
                                    format={({ value }) => {
                                        'worklet';
                                        const formattedPrice = formatUSD(value);
                                        return `${formattedPrice}`;
                                    }}
                                    style={{ fontSize: 30, color: 'white' }}
                                />
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
                        <View style={styles.separatorLine}></View>
                        {chart == 'candlesticks' ? <CandlestickChartDisplay /> : chart == 'line' ? <LineChartDisplay /> : <View></View>}
                        <View style={styles.separatorLine}></View>
                    </View>
                </View>
            </CandlestickChart.Provider>
        </LineChart.Provider>
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
        marginTop: '5%',
        borderColor: 'grey',
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        borderBottomColor: 'grey',
    },
    assetText: {
        fontSize: 20,
        color: 'white',
        fontWeight: 'bold'
    },
    swithToLineButton: {
        width: 70,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    swithToCandlesButton: {
        width: 70,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    separatorLine: {
        height: 1,
        width: '100%',
        backgroundColor: '#3e3e3e',
        alignSelf: 'center',
        marginTop: 5
    }
})