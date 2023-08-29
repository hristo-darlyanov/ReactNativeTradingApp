import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, SafeAreaView, Keyboard, Animated } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconOcticons } from 'react-native-vector-icons/Octicons';
import React, { useEffect, useState, useRef } from 'react'
import { auth } from '../../config/Firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

const SignUpScreen = ({ navigation }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmationPassword, setConfirmationPassword] = useState('')

  const [usernameValidationMessage, setUsernameValidationMessage] = useState('')
  const [emailValidationMessage, setEmailValidationMessage] = useState('')
  const [passwordValidationMessage, setPasswordValidationMessage] = useState('')
  const [confirmPasswordValidationMessage, setConfirmPasswordValidationMessage] = useState('')

  const keyboardShowListener = Keyboard.addListener(
    'keyboardDidShow',
    () => {
      fadeOut()
      setUsernameValidationMessage('')
      setEmailValidationMessage('')
      setPasswordValidationMessage('')
      setConfirmPasswordValidationMessage('')
    }
  );
  const keyboardHideListener = Keyboard.addListener(
    'keyboardDidHide',
    () => {
      fadeIn()
    }
  );

  function validInput() {
    // Username regex
    const usernameBetweenEightAndTwentyCharactersRegex = new RegExp(/^(?=.{3,12}$)/i)
    const usernameHasValidCharactersRegex = new RegExp(/(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/i)
    // Email regex
    const emailRegex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')
    // Password regex
    const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/)

    const passedTests = []
    // Validate username
    if (username != "") {
      if (usernameHasValidCharactersRegex.test(username)) {
        if (usernameBetweenEightAndTwentyCharactersRegex.test(username)) {
          passedTests.push(true)
        } else {
          setUsernameValidationMessage('Username must be 3-12 characters long')
          passedTests.push(false)
        }
      } else {
        setUsernameValidationMessage('Username must not contain special characters')
        passedTests.push(false)
      }
    }

    // Validate email
    if (email != "") {
      if (emailRegex.test(email)) {
        passedTests.push(true)
      } else {
        passedTests.push(false)
        setEmailValidationMessage('Incorrect email format')
      }
    } else {
      passedTests.push(false)
      setEmailValidationMessage("Email can't be empty")
    }

    // Validate password
    if (passwordRegex.test(password)) {
      passedTests.push(true)
    } else {
      passedTests.push(false)
      setPasswordValidationMessage('Password must contain 8+ characters and have at least 1 uppercase letter, 1 lowercase letter and 1 number')
    }

    // Validate confirmation password
    if (confirmationPassword === password) {
      passedTests.push(true)
    } else {
      passedTests.push(false)
      setConfirmPasswordValidationMessage('Passwords do not match')
    }

    return passedTests.every(Boolean)
  }

  const handleSignUp = () => {
    setUsernameValidationMessage('')
    setEmailValidationMessage('')
    setPasswordValidationMessage('')
    setConfirmPasswordValidationMessage('')

    if (validInput()) {
      // Create user
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user.email
          console.log('Successfully registered user:', user)
          // Set user's displayName
          if (username != "") {
            updateProfile(auth.currentUser, {
              displayName: username
            })
              .then(() => {
                console.log("Set displayname for user")
              }).catch((error) => {
                console.log(error.message)
              });
          }
        })
        .catch(error => console.log(error.message))
    }
  }

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.screenWrapper}>
        <Animated.View
          style={[styles.backButton, { opacity: fadeAnim }]}>
          <IconAntDesign.Button
            name="left"
            size={43}
            backgroundColor={'black'}
            color="white"
            onPress={() => navigation.navigate('EntryScreen')}
            borderRadius={50}
            iconStyle={{ marginRight: -5 }}
            underlayColor="grey" />
        </Animated.View>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.titleText}>Create account</Text>
        </Animated.View>
        <SafeAreaView style={styles.inputWrapper}>

          {/* Username field */}

          <View style={styles.userContainer}>
            <IconAntDesign
              name="user"
              size={30}
              color="white"
              style={{ marginRight: 10 }} />
            <TextInput
              style={styles.input}
              placeholder='Enter username'
              placeholderTextColor='grey'
              autoCapitalize='none'
              value={username}
              onChangeText={(text) => setUsername(text)} />
          </View>
          <Text style={{ color: 'red', marginTop: 5, alignSelf: 'flex-start' }}>{usernameValidationMessage}</Text>

          {/* Email field */}

          <View style={styles.emailContainer}>
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
          <Text style={{ color: 'red', marginTop: 5, alignSelf: 'flex-start' }}>{emailValidationMessage}</Text>

          {/* Password field */}

          <View style={styles.passwordContainer}>
            <IconOcticons
              name="key"
              size={30}
              color="white"
              style={{ marginRight: 10, marginLeft: 0 }} />
            <TextInput
              style={styles.input}
              placeholder='Enter password'
              placeholderTextColor='grey'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={true}
              textContentType='password'
              value={password}
              onChangeText={(text) => setPassword(text)} />
          </View>
          <Text style={{ color: 'red', marginTop: 5, alignSelf: 'flex-start' }}>{passwordValidationMessage}</Text>

          {/* Confirm password field */}

          <View style={styles.confirmPasswordContainer}>
            <IconOcticons
              name="key"
              size={30}
              color="white"
              style={{ marginRight: 10, marginLeft: 0 }} />
            <TextInput
              style={styles.input}
              placeholder='Confirm password'
              placeholderTextColor='grey'
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={true}
              textContentType='password'
              value={confirmationPassword}
              onChangeText={(text) => setConfirmationPassword(text)} />
          </View>
          <Text style={{ color: 'red', marginTop: 5, alignSelf: 'flex-start' }}>{confirmPasswordValidationMessage}</Text>
        </SafeAreaView>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={handleSignUp}>
            <Text style={styles.signUpButtonText}>Sign up</Text>
          </TouchableOpacity>
          <View style={styles.secondOptionWrapper}>
            <Text style={{ color: 'grey', fontSize: 18 }}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.loginButtonText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default SignUpScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  inputWrapper: {
    marginBottom: 20,
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30
  },
  buttonWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '90%',
  },
  signUpButton: {
    backgroundColor: 'white',
    width: '100%',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 10
  },
  signUpButtonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold'
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  backButton: {
    marginTop: '10%',
    marginLeft: '3%',
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  input: {
    width: '100%',
    paddingVertical: 10,
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
    flex: 1,
    marginRight: 10
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    width: '100%',
    marginTop: 0
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderWidth: 1,
    width: '100%',
    marginTop: 0
  },
  confirmPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderWidth: 1,
    width: '100%',
    marginTop: 0
  },
  titleText: {
    color: 'white',
    fontSize: 30,
    marginBottom: 22
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'white',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    width: '100%',
  },
  secondOptionWrapper: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 30
  }
})