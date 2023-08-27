import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/Firebase';
import { CreateAgentTabContext } from './components/PublicContexts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import EntryScreen from './screens/entryStackScreens/EntryScreen';
import LoginScreen from './screens/entryStackScreens/LoginScreen';
import SignUpScreen from './screens/entryStackScreens/SignUpScreen';
import ResetPasswordScreen from './screens/entryStackScreens/ResetPasswordScreen';
import AgentsDashboardScreen from './screens/mainStackScreens/AgentsDashboardScreen';
import SettingsScreen from './screens/mainStackScreens/SettingsScreen';
import StatisticsScreen from './screens/mainStackScreens/StatisticsScreen';
import CreateAgentScreen from './screens/createAgentStackScreens/CreateAgentScreen';
import LinkedAccountsMainScreen from './screens/settingsStackScreens/LinkedAccountsMainScreen';
import LinkedAccountsCreateScreen from './screens/settingsStackScreens/LinkedAccountsCreateScreen';
import LinkBinanceAccount from './screens/settingsStackScreens/LinkedAccountsCreateOptions/LinkBinanceAccount';

// Creating screen navigators
const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const AuthenticatedUserContext = createContext()
const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  )
}

const CreateAgentTabProvider = ({ children }) => {
  const [isCreatingAgent, setIsCreatingAgent] = useState(false)
  return (
    <CreateAgentTabContext.Provider value={{ isCreatingAgent, setIsCreatingAgent }}>
      {children}
    </CreateAgentTabContext.Provider>
  )
}

// Stack that is used to log in or sign up a user 
function EntryStack() {
  return (
    <Stack.Navigator defaultScreenOption={EntryScreen} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EntryScreen" component={EntryScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
    </Stack.Navigator>
  )
}

function CreateAgentStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CreateAgentScreen" component={CreateAgentScreen} />
    </Stack.Navigator>
  )
}

function SettingsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LinkedAccountsMainScreen" component={LinkedAccountsMainScreen} />
      <Stack.Screen name="LinkedAccountsCreateScreen" component={LinkedAccountsCreateScreen} />
      <Stack.Screen name="LinkBinanceAccount" component={LinkBinanceAccount} />
    </Stack.Navigator>
  )
}

// The main screens of the app
function MainStack() {
  const [settingsIconColor, setSettingsIconColor] = useState('white')
  const [statisticsIconColor, setStatisticsIconColor] = useState('white')
  const [dashboardIconColor, setDashboardIconColor] = useState('#1e1e1e')

  return (
    <Tab.Navigator
      defaultScreenOption={AgentsDashboardScreen}
      screenOptions={styles.tabScreenOptions}
      barStyle={{ backgroundColor: '#1e1e1e' }}
      activeColor="white"
      tabBarColor="black"
      shifting={false}
      labeled={true}
    >
      <Tab.Screen
        name="AgentsDashboardScreen"
        component={AgentsDashboardScreen}
        listeners={{
          tabPress: e => {
            setSettingsIconColor('white')
            setStatisticsIconColor('white')
            setDashboardIconColor('#1e1e1e')
          },
        }}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" color={dashboardIconColor} size={26} />
          ),
        }} />
      <Tab.Screen
        name="StatisticsScreen"
        component={StatisticsScreen}
        listeners={{
          tabPress: e => {
            setSettingsIconColor('white')
            setStatisticsIconColor('#1e1e1e')
            setDashboardIconColor('white')
          },
        }}
        options={{
          tabBarLabel: "Statistics",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="show-chart" color={statisticsIconColor} size={26} />
          ),
        }} />
      <Tab.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        listeners={{
          tabPress: e => {
            setSettingsIconColor('#1e1e1e')
            setStatisticsIconColor('white')
            setDashboardIconColor('white')
          },
        }}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" color={settingsIconColor} size={26} />
          ),
        }} />
    </Tab.Navigator>
  )
}

function AllMainScreenStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainStack" component={MainStack}/>
      <Stack.Screen name="SettingsStack" component={SettingsStack}/>
    </Stack.Navigator>
  )
}

function RootNavigation() {
  const { isCreatingAgent, setIsCreatingAgent } = useContext(CreateAgentTabContext)
  let currentStack;
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async userSignedIn => {
      if (userSignedIn) {
        setUser(userSignedIn)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user])
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }
  if (user) {
    if (!isCreatingAgent) {
      currentStack = <AllMainScreenStack />
    } else {
      currentStack = <CreateAgentStack />
    }
  } else {
    currentStack = <EntryStack />
  }
  return (
    <NavigationContainer>
      {currentStack}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
        <CreateAgentTabProvider>
          <RootNavigation />
        </CreateAgentTabProvider>
    </AuthenticatedUserProvider>
  );
}

const styles = StyleSheet.create({
  tabScreenOptions: {
    headerShown: false,
  }
});
