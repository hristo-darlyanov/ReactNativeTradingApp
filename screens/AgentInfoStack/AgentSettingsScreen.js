import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import React from 'react'

const AgentSettingsScreen = ({ route, navigation }) => {
  const { entryPrice, apiKey, apiSecret, position, image, name, markPrice, unrealizedProfitPerc, unrealizedProfit } = route.params
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <IconAntDesign.Button
          name="left"
          size={45}
          backgroundColor={'black'}
          color="white"
          style={{ marginRight: -10, }}
          onPress={() => navigation.navigate('AgentInfoScreen', {
            entryPrice: entryPrice,
            apiKey: apiKey,
            apiSecret: apiSecret,
            position: position,
            image: image,
            name: name,
            markPrice: markPrice,
            unrealizedProfitPerc: unrealizedProfitPerc,
            unrealizedProfit: unrealizedProfit
          })}
        />
        <Text style={styles.titleText}>{name} <Text style={[styles.titleText, { fontWeight: '300' }]}>settings</Text></Text>
      </View>
      <View style={styles.optionsWrapper}>
        <View style={styles.optionsTitleWrapper}>
          <IconAntDesign
            name="tool"
            size={30}
            backgroundColor={'black'}
            color="white"
            style={{ marginRight: 5 }}
            onPress={() => { }}
          />
          <Text style={styles.optionTitleText}>Configure</Text>
        </View>
        <View style={styles.separatorLine}></View>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>State of agent</Text>
            <Text style={[styles.agentState, { color: position != 'inactive' ? '#33ff1c' : 'red' }]}>{position != 'inactive' ? 'ACTIVE' : 'INACTIVE'}</Text>
          </TouchableOpacity>
      </View>
    </View>
  )
}

export default AgentSettingsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  headerWrapper: {
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '14%',
    width: '90%'
  },
  titleText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold'
  },
  optionsWrapper: {
    flex: 1,
    alignSelf: 'center',
    width: '90%',
    marginTop: '10%'
  },
  optionTitleText: {
    color: 'white',
    fontSize: 25
  },
  optionsTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  separatorLine: {
    height: 1,
    width: '100%',
    alignSelf: 'center',
    backgroundColor: 'grey',
    marginBottom: '2%'
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  optionText: {
    color: '#919191',
    fontSize: 24,
    fontWeight: '300'
  },
  agentState: {
    color: 'white',
    fontSize: 24,
    backgroundColor: '#2e2e2e',
    padding: 5,
    borderRadius: 15
  }
})