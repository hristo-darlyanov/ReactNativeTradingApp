import { StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableHighlight } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconOcticons } from 'react-native-vector-icons/Octicons';
import React, { useState } from 'react'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handeLogin = () => {
        
    }

    return (
        <View style={styles.container}>
            <View style={styles.screenWrapper}>
                <View style={styles.backButton}>
                    <IconAntDesign.Button
                        name="left"
                        size={43}
                        backgroundColor={'black'}
                        color="white"
                        onPress={() => navigation.goBack()}
                        borderRadius={50}
                        iconStyle={{ marginRight: -5 }}
                        underlayColor="grey" />
                </View>
                <Text style={styles.titleText}>Welcome back</Text>
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
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        style={styles.loginButton}
                        onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={styles.loginButtonText}>Log in</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'white' }} />
                        <View>
                            <Text style={{ width: 50, textAlign: 'center', color: 'white' }}>or</Text>
                        </View>
                        <View style={{ flex: 1, height: 1, backgroundColor: 'white' }} />
                    </View>
                    <TouchableOpacity
                        style={styles.signUpButton}
                        onPress={() => navigation.navigate('SignUpScreen')}>
                        <Text style={styles.singUpButtonText}>Sign up</Text>
                    </TouchableOpacity>
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
        marginBottom: 60,
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
    signUpButton: {
        backgroundColor: 'black',
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 2,
        marginBottom: '7%',
        borderRadius: 10
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
        marginBottom: 10
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
    }
})