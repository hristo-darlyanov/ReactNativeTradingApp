import { StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react'

const TradeInfoCard = ({ timestamp, profit, side, quantity, symbol, agentName }) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                style={styles.linearGradient}
                colors={[profit > 0 ? 'green' : profit < 0 ? 'red' : '#1e1e1e', 'transparent']}
                start={{ x: 0, y: 1 }}
                end={{ x: 0.2, y: 0.1 }}
                locations={[0, 1]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', margin: '1%', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={styles.symbolText}>{symbol}</Text>
                        <Text style={styles.timestampText}>{new Date(timestamp).toLocaleDateString()}</Text>
                    </View>
                    <View>
                        <Text style={{ fontSize: 20, color: 'grey' }}>Agent name: <Text style={{ fontSize: 20, color: 'white' }}>{agentName}</Text></Text>
                        <Text style={{ fontSize: 20, color: 'grey' }}>Profit: <Text style={{ fontSize: 20, color: profit > 0 ? '#33ff1c' : profit < 0 ? 'red' : 'grey' }}>${profit.toFixed(2)}</Text></Text>
                    </View>
                </View>
            </LinearGradient>
        </View>
    )
}

export default TradeInfoCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '20%',
        backgroundColor: '#2e2e2e',
        borderRadius: 10,
        borderWidth: 3,
        borderColor: '#1e1e1e',
        marginTop: 10,
    },
    symbolText: {
        fontSize: 20,
        color: 'white'
    },
    timestampText: {
        fontSize: 18,
        color: 'white'
    }
})