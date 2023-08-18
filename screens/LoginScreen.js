import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Animated, Keyboard } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconOcticons } from 'react-native-vector-icons/Octicons';
import React, { useState, useRef } from 'react'
import { auth } from '../config/Firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    const keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            fadeOut()
        }
    );
    const keyboardHideListener = Keyboard.addListener(
        'keyboardDidHide',
        () => {
            fadeIn()
        }
    );

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const invalidCredentialsErrorPopup = () =>
        Alert.alert('Invalid credentials', 'The credentials you provided are incorrect', [
            { text: 'OK', onPress: () => { } },
        ]);

    const forgotPasswordMissingEmailErrorPopup = () =>
        Alert.alert('Missing email', 'There is no email provided', [
            { text: 'OK', onPress: () => { } },
        ]);

    const forgotPasswordUserNotFoundErrorPopup = () =>
        Alert.alert('This user does not exist', 'Make sure you typed the email correctly. If you dont have an account, sign up!', [
            { text: 'OK', onPress: () => { } },
        ]);

    const handeLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.email
                console.log('Successfully signed in user:', user)
            })
            .catch(error => {
                if (error.message == "Firebase: Error (auth/invalid-email).") {
                    invalidCredentialsErrorPopup()
                } else {
                    console.log(error.message)
                }
            })
    }

    const handleForgottenPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("Password reset email sent!")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorMessage == "Firebase: Error (auth/missing-email).") {
                    forgotPasswordMissingEmailErrorPopup()
                } else if (errorMessage == "Firebase: Error (auth/user-not-found).") {
                    forgotPasswordUserNotFoundErrorPopup()
                }
                console.log(errorMessage)
            });
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
                    <Text style={styles.titleText}>Welcome back</Text>
                </Animated.View>
                <View style={styles.inputWrapper}>
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
                            autoFocus={true}
                            value={email}
                            onChangeText={(text) => setEmail(text)} />
                    </View>
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
                </View>
                <View style={styles.forgotPasswordWrapper}>
                    <TouchableOpacity onPress={handleForgottenPassword}>
                        <Text style={styles.resetPasswordText}>Forgot password?</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={handeLogin}>
                        <Text style={styles.loginButtonText}>Log in</Text>
                    </TouchableOpacity>
                    <View style={styles.secondOptionWrapper}>
                        <Text style={{color: 'grey', fontSize: 18}}>Don't have an account? </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('SignUpScreen')}>
                            <Text style={styles.singUpButtonText}>Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default LoginScreen

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
        justifyContent: 'center'
    },
    buttonWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '90%',
    },
    loginButton: {
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10
    },
    loginButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold'
    },
    singUpButtonText: {
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
        top: 0
    },
    input: {
        width: '100%',
        paddingVertical: 15,
        fontSize: 18,
        marginBottom: 10,
        color: 'white'
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'white',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        width: '100%'
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
        marginTop: 20
    },
    titleText: {
        color: 'white',
        fontSize: 30,
        marginBottom: 22
    },
    forgotPasswordWrapper: {
        justifyContent: 'flex-end',
        alignSelf: 'flex-end',
        marginBottom: 25,
        marginRight: '5%'
    },
    resetPasswordText: {
        color: 'white',
        fontSize: 18,
    },
    secondOptionWrapper: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 30
    }
})