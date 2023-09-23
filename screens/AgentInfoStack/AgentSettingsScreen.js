import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { auth, db } from '../../config/Firebase';
import { query, collection, where, onSnapshot } from 'firebase/firestore';
import React, { useState, useLayoutEffect } from 'react'
import LeftPointingArrow from '../../components/LeftPointingArrow';

const AgentSettingsScreen = ({ route, navigation }) => {
  const { entryPrice, apiKey, apiSecret, position, image, name, markPrice, unrealizedProfitPerc, unrealizedProfit } = route.params
  const [deleteAgentModalVisible, setDeleteAgentModalVisible] = useState(false)
  const [changeAgentStateModalVisible, setChangeAgentStateModalVisible] = useState(false)
  const [agentData, setAgentData] = useState([])

  useLayoutEffect(() => {
    const q = query(collection(db, 'agents'), where('associatedAccountUserId', '==', auth.currentUser.uid))
    const snapShotUnsubscribe = onSnapshot(q, updatedQuery => {
      setAgentData(updatedQuery.docs.map(item => ({
        associatedUser: item.data().associatedAccountUserId,
        agentName: item.data().associatedAccountName,
        id: item.id
      })))
    })

    return snapShotUnsubscribe
  }, [])

  async function HandleAgentDeletion() {
    setDeleteAgentModalVisible(false)
    let sAgents = agentData.filter(x => x.agentName == name)
    sAgents = sAgents.find(x => x.associatedUser == auth.currentUser.uid)
    // await deleteDoc(doc(db, 'agents', sAgents.id))
    //   .then(() => {
    //     navigation.navigate("MainStack", { screen: "AgentsDashboardScreen" })
    //   })
  }

  function ChangeAgentStateModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={changeAgentStateModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalDescriptionTextWrapper}>
              <Text style={styles.modalDescriptionText}>
                 </Text>
            </View>
            <View style={styles.modalButtonWrapper}>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={() => {}}>
                <Text style={styles.modalTextStyle}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setChangeAgentStateModalVisible(false)}>
                <Text style={styles.modalTextStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  function DeleteAgentModal() {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteAgentModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalDescriptionTextWrapper}>
              <IconAntDesign
                name="warning"
                size={50}
                color="white"
                style={{ marginRight: 5 }}
                onPress={() => { }}
              />
              <Text style={styles.modalDescriptionText}>
                Deleting the agent will result in the closure of all positions, and all agent data will be permanently removed.
                This includes the removal of the agent from the statistics tab.
                It is strongly recommended that you turn the agent off instead.
                Are you sure you want to proceed with the deletion? </Text>
            </View>
            <View style={styles.modalButtonWrapper}>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={() => HandleAgentDeletion()}>
                <Text style={styles.modalTextStyle}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setDeleteAgentModalVisible(false)}>
                <Text style={styles.modalTextStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      <DeleteAgentModal />
      <ChangeAgentStateModal />
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
        <TouchableOpacity style={styles.option} onPress={() => setChangeAgentStateModalVisible(true)}>
          <Text style={styles.optionText}>State of agent</Text>
          <Text style={[styles.agentState, { color: position != 'inactive' ? '#33ff1c' : 'red' }]}>{position != 'inactive' ? 'ACTIVE' : 'INACTIVE'}</Text>
        </TouchableOpacity>

        <View style={styles.optionsTitleWrapper}>
          <IconAntDesign
            name="warning"
            size={30}
            backgroundColor={'black'}
            color="white"
            style={{ marginRight: 5 }}
            onPress={() => { }}
          />
          <Text style={styles.optionTitleText}>Danger zone</Text>
        </View>
        <View style={styles.separatorLine}></View>
        <TouchableOpacity style={styles.option} onPress={() => setDeleteAgentModalVisible(true)}>
          <Text style={styles.optionText}>Delete agent</Text>
          <LeftPointingArrow />
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
    marginBottom: '10%'
  },
  optionTitleText: {
    color: 'white',
    fontSize: 25
  },
  optionsTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 30
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    borderWidth: 1,
    width: '90%',
    height: '53%',
    alignItems: 'center',
  },
  modalDeleteButton: {
    borderRadius: 10,
    paddingVertical: 10,
    width: '47%',
    backgroundColor: 'red'
  },
  modalCloseButton: {
    borderRadius: 10,
    paddingVertical: 10,
    width: '47%',
    backgroundColor: '#3e3e3e'
  },
  modalButtonWrapper: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-between',
    marginBottom: 10
  },
  modalTextStyle: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 20
  },
  modalDescriptionText: {
    color: 'white',
    fontSize: 22,
    textAlign: 'center',
    marginTop: '7%',
  },
  modalDescriptionTextWrapper: {
    width: '90%',
    alignItems: 'center',
    marginTop: 20
  }
})