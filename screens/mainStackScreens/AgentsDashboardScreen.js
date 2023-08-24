import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { AgentTabContext } from '../../components/CreatingAgentContext';
import React, { useContext } from 'react'

const AgentsDashboardScreen = () => {
  const {isCreatingAgent, setIsCreatingAgent} = useContext(AgentTabContext)
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.titleText}>Dashboard</Text>
        <IconAntDesign.Button
          name="plus"
          size={45}
          backgroundColor={'black'}
          color="white"
          style={{marginRight: -10,}}
          onPress={() => setIsCreatingAgent(true)}
        />
      </View>
      <View style={styles.separatorLine}></View>
      <ScrollView contentContainerStyle={styles.contentWrapper}>
      </ScrollView>
    </View>
  )
}

export default AgentsDashboardScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black'
  },
  contentWrapper: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
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
    marginBottom: '2%',
    marginTop: '2%',
    alignSelf: 'center'
  },
})