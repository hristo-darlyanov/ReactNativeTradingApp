import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
import { createContext, useState, useContext, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/Firebase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import EntryScreen from './screens/entryStackScreens/EntryScreen';
import LoginScreen from './screens/entryStackScreens/LoginScreen';
import SignUpScreen from './screens/entryStackScreens/SignUpScreen';
import ResetPasswordScreen from './screens/entryStackScreens/ResetPasswordScreen';
import AgentsDashboardScreen from './screens/mainStackScreens/AgentsDashboardScreen';
import SettingsScreen from './screens/mainStackScreens/SettingsScreen';
import StatisticsScreen from './screens/mainStackScreens/StatisticsScreen';

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
        ), }} />
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

function RootNavigation() {
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
  return (
    <NavigationContainer>
      {user ? <MainStack /> : <EntryStack />}
    </NavigationContainer>
  )
}


export default function App() {
  return (
    <AuthenticatedUserProvider>
      <RootNavigation />
    </AuthenticatedUserProvider>
  );
}

const styles = StyleSheet.create({
  tabScreenOptions: {
    headerShown: false,
  }
});
