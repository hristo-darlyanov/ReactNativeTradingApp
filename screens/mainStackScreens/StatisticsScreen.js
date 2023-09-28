import { StyleSheet, Text, View } from 'react-native'
import { LineChart } from 'react-native-wagmi-charts';
import React, { useLayoutEffect, useState } from 'react'
import { TradesInformationFutures } from '../../BinanceAccountController';
import { auth, db } from '../../config/Firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { Dropdown } from 'react-native-element-dropdown';
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';

const StatisticsScreen = () => {
  const [tradesData, setTradesData] = useState([])
  const [agentData, setAgentData] = useState([])
  const [dropdownData, setDropdownData] = useState([{ label: 'All agents', value: 'all' }])
  const [value, setValue] = useState("all");
  const [isFocus, setIsFocus] = useState(false);
  const [lineData, setLineData] = useState([{ x: 0, value: 0 }])
  const [profit, setProfit] = useState('0')

  useLayoutEffect(() => {
    let itemsData = []
    const q = query(collection(db, 'agents'), where('associatedAccountUserId', '==', auth.currentUser.uid))
    const snapShotUnsubscribe = onSnapshot(q, updatedQuery => {
      itemsData = updatedQuery.docs.map(item => ({
        apiKey: item.data().apiKey,
        apiSecret: item.data().apiSecret,
        associatedUser: item.data().associatedAccountUserId,
        agentName: item.data().associatedAccountName,
        dateOfCreation: item.data().dateOfCreation,
        exchange: item.data().exchange,
        position: item.data().position,
        id: item.id
      }))

      setAgentData(itemsData)

      const dropdownResult = itemsData.map(x => ({
        label: x.agentName,
        value: {
          name: x.agentName,
          apiKey: x.apiKey,
          apiSecret: x.apiSecret,
          dateCreated: x.dateOfCreation
        }
      }))
      dropdownResult.splice(0, 0, { label: 'All agents', value: 'all' })
      setDropdownData(dropdownResult)

      dropdownResult.forEach(item => {
        if (item.label == 'All agents') {
          return
        }
        TradesInformationFutures(item.value.dateCreated, item.value.apiKey, item.value.apiSecret,)
          .then((data) => {
            let trades = []
            data.forEach(trade => {
              trades.push({ [item.label]: trade })
            })
            setTradesData(trades)
          })
      })
    })

    return snapShotUnsubscribe
  }, [])

  useLayoutEffect(() => {
    function ChangeData() {
      let profit = 0
      let tempTrades = []
      if (tradesData.length != 0) {
        if (value == 'all') {
          tradesData.forEach(item => {
            const realizedProfit = Object.values(item).map(x => ({
              timestamp: x.time,
              value: x.realizedPnl
            }))
            realizedProfit.forEach(item => {
              profit += parseFloat(item.value)
              tempTrades.push(item)
            })
          })
          setLineData(tempTrades)
          setProfit(profit)
        } else {
          tradesData.forEach(item => {
            const agentName = Object.keys(item)[0]
            if (agentName == value.name) {
              const realizedProfit = Object.values(item).map(x => ({
                timestamp: x.time,
                value: x.realizedPnl
              }))
              realizedProfit.forEach(item => {
                profit += parseFloat(item.value)
                tempTrades.push(item)
              })
            }
          })
          setLineData(tempTrades)
          setProfit(profit)
        }
      }
    }

    ChangeData()
  }, [tradesData, value])

  return (
    <LineChart.Provider data={lineData}>
      <View style={styles.container}>
        <Text style={styles.titleWrapper}>Agents statistics</Text>
        <View style={styles.chartWrapper}>
          <LineChart height={200}>
            <LineChart.Path color='white' />
            <LineChart.CursorLine />
          </LineChart>
        </View>
        <View style={styles.dropdownWrapper}>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={dropdownData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'All agents' : '...'}
            searchPlaceholder="Search..."
            containerStyle={{ backgroundColor: 'black', borderRadius: 5 }}
            itemContainerStyle={{ backgroundColor: 'black', borderRadius: 5 }}
            activeColor='black'
            itemTextStyle={{ color: 'white' }}
            value={value}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={item => {
              setValue(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <IconAntDesign
                style={styles.icon}
                color={isFocus ? 'white' : 'grey'}
                name="menuunfold"
                size={20}
              />
            )}
          />
          <Text style={styles.profitText}>Profit - {profit}</Text>
        </View>
      </View>
    </LineChart.Provider>
  )
}

export default StatisticsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  chartWrapper: {
    borderColor: '#3e3e3e',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    backgroundColor: '#1e1e1e',
  },
  titleWrapper: {
    marginTop: '15%',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    marginBottom: '2%',
    marginLeft: '5%'
  },
  separatorLine: {
    height: 1,
    backgroundColor: '#3e3e3e',
    width: '100%'
  },
  profitText: {
    color: 'white',
    marginLeft: '3%',
    fontSize: 26
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    width: '50%'
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 20,
    color: 'white'
  },
  selectedTextStyle: {
    fontSize: 20,
    color: 'white'
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '2%',
    marginTop: '2%'
  }
})