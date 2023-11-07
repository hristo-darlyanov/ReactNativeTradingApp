import { ScrollView, StyleSheet, Text, View, FlatList, SafeAreaView, TouchableOpacity, Modal } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { CreateAgentTabContext, ErrorFetchingDataContext, LoadedAgentInfoContext, RefreshingAgentsTabContext } from '../../components/PublicContexts';
import AgentInfoCard from '../../components/AgentInfoCard';
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { db, auth } from '../../config/Firebase';
import { query, where, onSnapshot, collection } from 'firebase/firestore';

const AgentsDashboardScreen = ({ navigation }) => {
  const { isCreatingAgent, setIsCreatingAgent } = useContext(CreateAgentTabContext)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(true)
  const [error, setError] = useState(false)
  const [agentData, setAgentData] = useState([])
  const [modalVisible, setModalVisible] = useState(false);

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
        currentOrderId: item.data().currentOrderId,
        id: item.id
      })))
    })

    return snapShotUnsubscribe
  }, [])

  // useEffect(() => {
  //   if (error == true) {
  //     setModalVisible(true)
  //     setError(false)
      
  //     setTimeout(() => {
  //       if (modalVisible) {
  //         setModalVisible(false)
  //       }
  //     }, 3000);
  //   }
  // }, [error])

  function InternetErrorModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Check internet connection</Text>
          </View>
        </View>
      </Modal>
    )
  }

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
    <RefreshingAgentsTabContext.Provider value={{ isRefreshing, setIsRefreshing }}>
      <LoadedAgentInfoContext.Provider value={{ dataLoaded, setDataLoaded }} >
        <ErrorFetchingDataContext.Provider value={{ error, setError }} >
          <InternetErrorModal />
          <View style={styles.container}>
            <SafeAreaView>
              <FlatList
                onRefresh={() => {
                  setDataLoaded(false)
                  setIsRefreshing(true)
                }}
                refreshing={isRefreshing}
                keyExtractor={(item) => item.agentName}
                data={agentData}
                renderItem={({ item }) => (
                  <AgentInfoCard
                    name={item.agentName}
                    exchange={item.exchange}
                    position={item.position}
                    apiKey={item.apiKey}
                    apiSecret={item.apiSecret}
                    dateOfCreation={item.dateOfCreation}
                    currentOrderId={item.currentOrderId}
                  />
                )}
                ListHeaderComponent={<FlatListHeader />}
              />
            </SafeAreaView>
          </View>
        </ErrorFetchingDataContext.Provider>
      </LoadedAgentInfoContext.Provider>
    </RefreshingAgentsTabContext.Provider>
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
    fontSize: 40,
    fontWeight: 'bold'
  },
  separatorLine: {
    width: '90%',
    backgroundColor: 'grey',
    height: 1,
    marginBottom: '4%',
    marginTop: '2%',
    alignSelf: 'center'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '93%',
    alignItems: 'center',
    marginBottom: '30%'
  },
  modalText: {
    color: 'black',
    fontSize: 27,
    paddingVertical: 10
  }
})