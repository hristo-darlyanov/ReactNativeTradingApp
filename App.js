import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import EntryScreen from './screens/entryStackScreens/EntryScreen';
import LoginScreen from './screens/entryStackScreens/LoginScreen';
import SignUpScreen from './screens/entryStackScreens/SignUpScreen';
import ResetPasswordScreen from './screens/entryStackScreens/ResetPasswordScreen';
import AgentsDashboardScreen from './screens/mainStackScreens/AgentsDashboardScreen';
import OptionsScreen from './screens/mainStackScreens/OptionsScreen';
import StatisticsScreen from './screens/mainStackScreens/StatisticsScreen';

// Creating screen navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
  return (
    <Tab.Navigator defaultScreenOption={AgentsDashboardScreen}>
      <Tab.Screen name="AgentsDashboardScreen" component={AgentsDashboardScreen} />
      <Tab.Screen name="OptionsScreen" component={OptionsScreen} />
      <Tab.Screen name="StatisticsScreen" component={StatisticsScreen}/>
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <MainStack />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
