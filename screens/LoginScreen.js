import { StyleSheet, Text, TextInput, View, TouchableOpacity, TouchableHighlight } from 'react-native'
import { default as IconAntDesign }from 'react-native-vector-icons/AntDesign';
import { default as IconOcticons }from 'react-native-vector-icons/Octicons';
import React, { useState } from 'react'

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    return (
        <View style={styles.container}>
            <View style={styles.backButton}>
                <IconAntDesign.Button
                    name="left"
                    size={43}
                    backgroundColor={'#2e2e2e'}
                    color="white"
                    onPress={() => navigation.goBack()}
                    borderRadius={50}
                    iconStyle={{ marginRight: 5 }}
                    underlayColor="grey" />
            </View>
            <View style={styles.screenWrapper}>
                <View style={styles.inputWrapper}>
                    <View style={styles.emailContainer}>
                        <IconOcticons
                            name="mail"
                            size={30}
                            color="white"
                            style={{marginRight: 10}} />
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
                            style={{marginRight: 10, marginLeft: 0}}/>
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
        backgroundColor: '#2e2e2e',
        height: '100%',
    },
    screenWrapper: {
        flex: 1,
        backgroundColor: 'black',
        position: 'absolute',
        height: '70%',
        width: '100%',
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    inputWrapper: {
        marginBottom: 70,
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
        marginTop: '7%',
        flex: 1,
        position: 'absolute',
        alignItems: 'center'
    },
    input: {
        width: '100%',
        paddingVertical: 15,
        fontSize: 18
    },
    emailContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'white',
        borderWidth: 1,
        width: '100%'
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'white',
        borderWidth: 1,
        width: '100%',
        marginTop: 20
    }
})