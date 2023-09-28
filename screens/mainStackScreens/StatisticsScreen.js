import { StyleSheet, Text, View } from 'react-native'
import { LineChart } from 'react-native-wagmi-charts';
import React, { useLayoutEffect, useState } from 'react'
import { TradesInformationFutures } from '../../BinanceAccountController';
import { auth, db } from '../../config/Firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import { Dropdown } from 'react-native-element-dropdown';
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';

const data = [
  {
    timestamp: 1625945400000,
    value: 33575.25,
  },
  {
    timestamp: 1625946300000,
    value: 33545.25,
  },
  {
    timestamp: 1625947200000,
    value: 33510.25,
  },
  {
    timestamp: 1625948100000,
    value: 33215.25,
  },
];

const StatisticsScreen = () => {
  const [tradesData, setTradesData] = useState([])
  const [agentData, setAgentData] = useState([])
  const [dropdownData, setDropdownData] = useState([{ label: 'All', value: 'all' }])
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  useLayoutEffect(() => {
    let itemsData= []
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
          apiKey: x.apiKey,
          apiSecret: x.apiSecret,
          dateCreated: x.dateOfCreation
        }
      }))
      dropdownResult.splice(0, 0, { label: 'All', value: 'all' })
      setDropdownData(dropdownResult)

      dropdownResult.forEach(item => {
        if (item.label == 'All') {
          return
        }
        TradesInformationFutures(item.value.dateCreated, item.value.apiKey, item.value.apiSecret,)
          .then((data) => {
            let trades = []
            data.forEach(trade => {
              trades.push({[item.label]: trade})
            })
            setTradesData(trades)
          })
      })
    })

    return snapShotUnsubscribe
  }, [])

  return (
    <LineChart.Provider data={data}>
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
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={dropdownData}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? 'Select item' : '...'}
            searchPlaceholder="Search..."
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
          <Text style={styles.profitText}>Profit - </Text>
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
    borderWidth: 0.5,
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
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  }
})