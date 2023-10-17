import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconMaterialIcons } from 'react-native-vector-icons/MaterialIcons';
import { LineChart } from 'react-native-wagmi-charts';
import { GetKlines, OrdersInformationFutures } from '../../BinanceAccountController';

const AgentInfoScreen = ({ route, navigation }) => {
    const { entryPrice, currentOrderId, apiKey, apiSecret, position, image, name, markPrice, unrealizedProfitPerc, unrealizedProfit, dateOfCreation } = route.params
    const [fourHourLineData, setFourHourLineData] = useState([{ x: 0, value: 0 }])
    const [oneDayLineData, setOneDayLineData] = useState([{ x: 0, value: 0 }])
    const [lineData, setLineData] = useState([{ x: 0, value: 0 }])
    const [chart, setChart] = useState('fourHours')
    const [fourHourChartButtonProps, setFourHourChartButtonProps] = useState({ borderColor: '#3e3e3e', backgroundColor: '#3e3e3e' })
    const [fourHourChartIconColor, setFourHourChartIconColor] = useState('grey')
    const [oneDayChartButtonProps, setOneDayChartButtonProps] = useState({ borderColor: 'grey', backgroundColor: 'white' })
    const [oneDayChartIconColor, setOneDayChartIconColor] = useState('#2e2e2e')
    const [horizontalLineProps, setHorizontalLineProps] = useState({ at: { value: -1 }, })
    const [lineHighlightProps, setLineHighlightProps] = useState({ color: 'white' })
    const [dotProps, setDotProps] = useState({})
    const [orderData, setOrderData] = useState({})
    const [positionEntryDate, setCurrentDate] = useState('')
    const [positionEntryDateNumbersOnly, setPositionEntryDateNumbersOnly] = useState('')
    const positionColor = position == 'hold' ? 'grey' : position == 'BUY' ? '#33ff1c' : 'red'
    const profitColor = unrealizedProfit > 0 ? '#33ff1c' : unrealizedProfit < 0 ? 'red' : 'grey'
    const dfc = new Date(dateOfCreation * 1)
    const formattedDateOfCreation = `${dfc.getDate()} | ${dfc.getMonth() + 1} | ${dfc.getFullYear()}`

    const formatUSD = value => {
        'worklet';
        if (value === '') {
            if (lineData.length == 0) {
                return ''
            }
            const formattedValue = `${parseFloat(markPrice).toFixed(2)}`
            return `${formattedValue}`
        }

        const formattedValue = `${parseFloat(value).toFixed(2)}`
        return `${formattedValue}`
    }

    const formatDate = value => {
        'worklet'
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        if (value == '-1') {
            if (lineData.length < 5) {
                return ''
            }
            return positionEntryDate
        }

        const tempDate = new Date(value)
        const date = `${tempDate.getDate()} | ${months[tempDate.getMonth()]} | ${tempDate.getFullYear()}   ( ${tempDate.getHours()}h )`
        return date
    }

    function LineChartDisplay() {
        return (
            <LineChart height={360}>
                <LineChart.Path color='white' >
                    <LineChart.HorizontalLine {...horizontalLineProps} />
                    <LineChart.Dot {...dotProps} />
                    <LineChart.Highlight {...lineHighlightProps} />
                    <LineChart.Gradient color='white' />
                </LineChart.Path>
                <LineChart.CursorLine />
            </LineChart>
        )
    }

    useEffect(() => {
        if (chart == 'oneDay') {
            setOneDayChartButtonProps({ borderColor: '#3e3e3e', backgroundColor: 'white' })
            setOneDayChartIconColor('#2e2e2e')
            setFourHourChartButtonProps({ borderColor: 'grey', backgroundColor: '#3e3e3e' })
            setFourHourChartIconColor('grey')
        } else if (chart == 'fourHours') {
            setFourHourChartButtonProps({ borderColor: '#3e3e3e', backgroundColor: 'white' })
            setFourHourChartIconColor('#2e2e2e')
            setOneDayChartButtonProps({ borderColor: 'grey', backgroundColor: '#3e3e3e' })
            setOneDayChartIconColor('grey')
        }
    }, [chart])

    useEffect(() => {
        if (orderData != {} && lineData.length > 4) {
            let lineDataConvertedTimes = []
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            const positionConvertedTimestamp = new Date(orderData.time)
            for (let index = 0; index < lineData.length; index++) {
                lineDataConvertedTimes.push(new Date(lineData[index].timestamp))
            }
            if (position != 'hold') {
                let indexOfPosition = -1
                if (chart == 'fourHours') {
                    indexOfPosition = lineDataConvertedTimes.findIndex(x => x.getDate() == positionConvertedTimestamp.getDate() && x.getHours() + 4 > positionConvertedTimestamp.getHours())
                } else if (chart == 'oneDay') {
                    indexOfPosition = lineDataConvertedTimes.findIndex(x => x.getDate() == positionConvertedTimestamp.getDate())
                }

                if (indexOfPosition == -1) {
                    indexOfPosition = 0
                }

                setDotProps({
                    at: indexOfPosition,
                    color: profitColor,
                    size: 6,
                    hasOuterDot: true,
                    outerSize: 12
                })
                setLineHighlightProps({ color: profitColor, from: indexOfPosition, to: 30 })
                setHorizontalLineProps({ at: { index: indexOfPosition } })
                const tempLineData = lineData
                tempLineData[indexOfPosition] = {
                    value: entryPrice.toFixed(2),
                    timestamp: orderData.time
                }

                setLineData(tempLineData)
                const tempDate = new Date(orderData.time)
                const currentDate = new Date(Date.now())
                const date = `${currentDate.getDate()} | ${months[currentDate.getMonth()]} | ${currentDate.getFullYear()}   ( ${currentDate.getHours()}h )`
                const cleanDate = `${tempDate.getDate()} | ${tempDate.getMonth() + 1} | ${tempDate.getFullYear()}   ( ${tempDate.getHours()}h )`
                setCurrentDate(date)
                setPositionEntryDateNumbersOnly(cleanDate)
            }
        }
    }, [orderData, lineData])

    useLayoutEffect(() => {
        async function GetOrdersData() {
            if (position != 'hold') {
                await OrdersInformationFutures(apiKey, apiSecret, currentOrderId)
                    .then((data) => {
                        const order = data.find(x => parseFloat(x.avgPrice).toFixed(2) == entryPrice.toFixed(2))
                        setOrderData(order)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            }
        }

        GetOrdersData()
    }, [])

    useLayoutEffect(() => {
        async function GetKlinesData() {
            await GetKlines()
                .then((data) => {
                    let oneDayData = []

                    data.forEach(item => {
                        if (new Date(item[6]).getHours() == 2) {
                            oneDayData.push({
                                timestamp: item[6],
                                value: parseFloat(item[4])
                            })
                        }
                    });

                    let fourHourData = data.map(x => ({
                        timestamp: x[6],
                        value: parseFloat(x[4])
                    }))

                    fourHourData = fourHourData.slice(-30)

                    setLineData(fourHourData)
                    setFourHourLineData(fourHourData)
                    setOneDayLineData(oneDayData)
                })
                .catch(error => {
                    console.log(error)
                })
        }

        GetKlinesData()
    }, [])

    return (
        <LineChart.Provider data={lineData}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <IconAntDesign.Button
                        name="left"
                        size={43}
                        backgroundColor={'black'}
                        color="grey"
                        onPress={() => navigation.navigate("MainStack", { screen: "AgentsDashboardScreen" })}
                        borderRadius={50}
                        iconStyle={{ marginRight: 5 }} />
                    <View style={styles.headerTitleWrapper}>
                        <Text style={styles.headerText}>{name}</Text>
                        <Image style={styles.image} source={image} />
                    </View>
                    <IconMaterialIcons.Button
                        name="settings"
                        size={43}
                        backgroundColor={'black'}
                        color="grey"
                        onPress={() => navigation.navigate('AgentSettingsScreen', {
                            entryPrice: entryPrice,
                            apiKey: apiKey,
                            apiSecret: apiSecret,
                            position: position,
                            image: image,
                            name: name,
                            markPrice: markPrice,
                            unrealizedProfitPerc: unrealizedProfitPerc,
                            unrealizedProfit: unrealizedProfit,
                            dateOfCreation: dateOfCreation
                        })}
                        borderRadius={50}
                        iconStyle={{ marginRight: '5%' }} />
                </View>
                <View style={styles.chartContainer}>
                    <View style={styles.chartHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ marginRight: 10, marginLeft: 5 }}>
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
                            <TouchableOpacity style={[styles.swithToLineButton, { ...fourHourChartButtonProps }]} onPress={() => {
                                setChart('fourHours')
                                setLineData(fourHourLineData)
                            }}>
                                <Text style={{ color: fourHourChartIconColor, fontSize: 20, fontWeight: 'bold' }}>4h</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.swithToCandlesButton, { ...oneDayChartButtonProps }]} onPress={() => {
                                setChart('oneDay')
                                setLineData(oneDayLineData)
                            }}>
                                <Text style={{ color: oneDayChartIconColor, fontSize: 20, fontWeight: 'bold' }}>1D</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.separatorLine}></View>
                    <LineChartDisplay />
                    <View style={styles.separatorLine}></View>
                    <View style={styles.dateInfo}>
                        <LineChart.DatetimeText
                            format={({ value }) => {
                                'worklet';
                                const formattedDate = formatDate(value);
                                return formattedDate;
                            }}
                            style={styles.formattedDate} />
                    </View>
                </View>
                <View style={styles.infoContainer}>
                    <Text style={{ color: 'white', fontSize: 30, fontWeight: '800', marginLeft: '2%' }}>Trade statistics</Text>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoDescriptionText}>Side </Text>
                        <Text style={[styles.infoValueText, { color: position != 'inactive' ? positionColor : 'grey' }]}>{position.toUpperCase()}</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoDescriptionText}>Unrealized profit %</Text>
                        <Text style={[styles.infoValueText, { color: profitColor }]}>{position != 'hold' ? parseFloat(unrealizedProfitPerc).toFixed(2) : '0'}%</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoDescriptionText}>Unrealized profit </Text>
                        <Text style={[styles.infoValueText, { color: profitColor }]}>{parseFloat(unrealizedProfit).toFixed(2)} USDT</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoDescriptionText}>Entry price </Text>
                        <Text style={styles.infoValueText}>{parseFloat(entryPrice).toFixed(2)}</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoDescriptionText}>Market price</Text>
                        <Text style={styles.infoValueText}>{parseFloat(markPrice).toFixed(2)}</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoDescriptionText}>Margin</Text>
                        <Text style={styles.infoValueText}>{Object.keys(orderData).length != 0 ? parseFloat(orderData.cumQuote).toFixed(2) : '0'} USDT</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoDescriptionText}>Type</Text>
                        <Text style={[styles.infoValueText, { color: 'grey' }]}>Market</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoDescriptionText}>Entry date</Text>
                        <Text style={styles.infoValueText}>{position != 'hold' ? positionEntryDateNumbersOnly : 'Not in a trade'}</Text>
                    </View>
                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoDescriptionText}>Executed quantity</Text>
                        <Text style={styles.infoValueText}>{Object.keys(orderData).length != 0 ? orderData.executedQty : '0'}</Text>
                    </View>
                    <View style={[styles.infoWrapper, { marginTop: 30 }]}>
                        <Text style={styles.infoDescriptionText}>Agent created on</Text>
                        <Text style={styles.infoValueText}>{formattedDateOfCreation}</Text>
                    </View>
                </View>
            </ScrollView>
        </LineChart.Provider>
    )
}

export default AgentInfoScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    headerContainer: {
        marginTop: '10%',
        marginLeft: '3%',
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    chartContainer: {
        backgroundColor: '#1e1e1e',
        marginTop: '5%',
        borderColor: '#3e3e3e',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderRadius: 20
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
        marginLeft: 5,
        marginRight: 5,
        marginBottom: 5,
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
    },
    dateInfo: {
        width: '100%',
        height: 30
    },
    formattedDate: {
        color: 'white',
        fontSize: 18,
        fontWeight: '400',
        alignSelf: 'center',
    },
    image: {
        width: 50,
        height: 50,
    },
    headerText: {
        fontSize: 44,
        fontWeight: 'bold',
        color: 'white',
        marginRight: '5%'
    },
    headerTitleWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoContainer: {
        flex: 1,
        width: '95%',
        marginTop: '5%',
        alignSelf: 'center',
        marginBottom: '5%'
    },
    infoDescriptionText: {
        color: '#adadad',
        fontSize: 22,
        fontWeight: 'bold'
    },
    infoValueText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold'
    },
    infoWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        backgroundColor: '#1e1e1e',
        paddingHorizontal: 10,
        marginTop: '1%',
        marginBottom: '1%'
    },
    settingsText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
})