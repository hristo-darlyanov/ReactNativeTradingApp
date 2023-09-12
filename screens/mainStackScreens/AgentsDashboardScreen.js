import { ScrollView, StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { CreateAgentTabContext } from '../../components/PublicContexts';
import AgentInfoCard from '../../components/AgentInfoCard';
import React, { useContext, useLayoutEffect, useState } from 'react'
import { db, auth } from '../../config/Firebase';
import { query, where, onSnapshot, collection } from 'firebase/firestore';

const AgentsDashboardScreen = () => {
  const { isCreatingAgent, setIsCreatingAgent } = useContext(CreateAgentTabContext)
  const [agentData, setAgentData] = useState([])

  useLayoutEffect(() => {
    const q = query(collection(db, 'agents'), where('associatedAccountUserId', '==', auth.currentUser.uid))
    const snapShotUnsubscribe = onSnapshot(q, updatedQuery => {
      setAgentData(updatedQuery.docs.map(item => ({
        apiKey: item.data().apiKey,
        apiSecret: item.data().apiSecret,
        associatedUser: item.data().associatedAccountUserId,
        agentName: item.data().associatedAccountName,
        dateOfCreation: item.data().dateOfCreation,
        exchange: item.data().exchange,
        position: item.data().position,
        id: item.id
      })))
    })

    return snapShotUnsubscribe
  }, [])

  function FlatListHeader() {
    return (
      <>
        <View style={styles.headerWrapper}>
          <Text style={styles.titleText}>Dashboard</Text>
          <IconAntDesign.Button
            name="plus"
            size={45}
            backgroundColor={'black'}
            color="white"
            style={{ marginRight: -10, }}
            onPress={() => setIsCreatingAgent(true)}
          />
        </View>
        <View style={styles.separatorLine}></View>
      </>
    )
  }

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <FlatList
          keyExtractor={(item) => item.agentName}
          data={agentData}
          renderItem={({ item }) => (
            <AgentInfoCard
              name={item.agentName}
              exchange={item.exchange}
              position={item.position}
              apiKey={item.apiKey}
              apiSecret={item.apiSecret}
              onPress={() => { }}
            />
          )}
          ListHeaderComponent={<FlatListHeader />}
        />
      </SafeAreaView>
    </View>
  )
}

export default AgentsDashboardScreen

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
    fontSize: 33
  },
  separatorLine: {
    width: '90%',
    backgroundColor: 'grey',
    height: 1,
    marginBottom: '4%',
    marginTop: '2%',
    alignSelf: 'center'
  },
})