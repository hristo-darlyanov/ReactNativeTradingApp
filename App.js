import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EntryScreen from './screens/EntryScreen';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

function EntryStack() {
  <Stack.Navigator>
    <Stack.Screen name="EntryScreen" component={EntryScreen}/>
  </Stack.Navigator>
}

export default function App() {
  return (
    <NavigationContainer>
      <EntryScreen/>
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
