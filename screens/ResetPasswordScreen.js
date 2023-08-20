import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconOcticons } from 'react-native-vector-icons/Octicons';

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('')

  return (
    <View style={styles.container}>
      <View
        style={styles.backButton}>
        <IconAntDesign.Button
          name="left"
          size={43}
          backgroundColor={'black'}
          color="white"
          onPress={() => navigation.navigate('LoginScreen')}
          borderRadius={50}
          iconStyle={{ marginRight: -5 }}
          underlayColor="grey" />
      </View>
      <View style={styles.contentWrapper}>
        <Text style={styles.titleText}>Forgot password?</Text>
        <Text style={styles.descriptonText}>
          Type the email of the account you are having trouble signing in and if the account exists an email will be sent to it.</Text>
        <View style={styles.inputWrapper}>
          <IconOcticons
            name="mail"
            size={30}
            color="white"
            style={{ marginRight: 10 }} />
          <TextInput
            style={styles.input}
            placeholder='Enter email'
            placeholderTextColor='grey'
            autoCapitalize='none'
            keyboardType='email-address'
            textContentType='emailAddress'
            value={email}
            onChangeText={(text) => setEmail(text)} />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>
            Reset password
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ResetPasswordScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  backButton: {
    marginTop: '10%',
    marginLeft: '3%',
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0
  },
  titleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 20
  },
  descriptonText: {
    color: 'white',
    fontSize: 20
  },
  input: {

  },
  contentWrapper: {
    alignItems: 'center',
    width: '90%'
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    width: '95%',
    marginTop: 20,
    marginBottom: 40
  },
  input: {
    width: '100%',
    paddingVertical: 15,
    fontSize: 18,
    marginBottom: 10,
    color: 'white'
  },
  button: {
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 18
  }
})