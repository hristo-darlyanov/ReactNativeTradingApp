import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TradeInfoCard = ({tradeInfo}) => {
  return (
    <View style={styles.container}>
      <Text>TradeInfoCard</Text>
    </View>
  )
}

export default TradeInfoCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '20%',
        backgroundColor: 'white'
    }
})