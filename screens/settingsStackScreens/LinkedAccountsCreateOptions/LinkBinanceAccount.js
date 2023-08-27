import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconOcticons } from 'react-native-vector-icons/Octicons';
import React, { useState } from 'react'

const LinkBinanceAccount = ({ navigation }) => {
    const [areCredentialsValid, setAreCredentialsValid] = useState(0)
    const [apiKey, setApiKey] = useState('')
    const [apiSecret, setApiSecret] = useState('')

    const handleLinkingAccount = async () => {
        setAreCredentialsValid(0)
        const Binance = require('node-binance-api');
        const binance = new Binance().options({
            APIKEY: apiKey,
            APISECRET: apiSecret,
            test: true,
            urls: {
                base: 'https://testnet.binancefuture.com/'
            }
        });
        await binance.futuresAccount().then(() => {
            console.log(true)
        })
        .catch(error => {
            console.log(false)
            setAreCredentialsValid(1)
        })
    }

    return (
        <View style={styles.container}>
            <View
                style={styles.backButton}>
                <IconAntDesign.Button
                    name="left"
                    size={43}
                    backgroundColor={'black'}
                    color="grey"
                    onPress={() => navigation.goBack()}
                    borderRadius={50}
                    iconStyle={{ marginRight: 5 }}
                    underlayColor="grey" />
            </View>
            <View style={styles.headerWrapper}>
                <Image style={styles.image} source={require('../../../assets/exchange-logos/Binance_Logo.png')} />
            </View>
            <View style={styles.separatorLine}></View>
            <View style={styles.inputWrapper}>
                <Text style={styles.credentialsText}>Enter api Key:</Text>
                <View style={styles.apiKeyContainer}>
                    <IconOcticons
                        name="key"
                        size={30}
                        color="white"
                        style={{ marginRight: 10, marginLeft: 20 }} />
                    <TextInput
                        style={styles.input}
                        placeholderTextColor='grey'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={true}
                        textContentType='password'
                        value={apiKey}
                        onChangeText={(text) => setApiKey(text)} />
                </View>
                <Text style={{ color: 'red', marginTop: 5, alignSelf: 'flex-start', opacity: areCredentialsValid }}>Incorrect credentials</Text>
            </View>
            <View style={styles.inputWrapper}>
                <Text style={styles.credentialsText}>Enter api secret:</Text>
                <View style={styles.apiKeyContainer}>
                    <IconOcticons
                        name="key"
                        size={30}
                        color="white"
                        style={{ marginRight: 10, marginLeft: 20 }} />
                    <TextInput
                        style={styles.input}
                        placeholderTextColor='grey'
                        autoCapitalize='none'
                        autoCorrect={false}
                        secureTextEntry={true}
                        textContentType='password'
                        value={apiSecret}
                        onChangeText={(text) => setApiSecret(text)} />
                </View>
                <Text style={{ color: 'red', marginTop: 5, alignSelf: 'flex-start', opacity: areCredentialsValid }}>Incorrect credentials</Text>
            </View>
            <View style={styles.linkAccountButtonWrapper}>
                <TouchableOpacity style={styles.linkAccountButton}>
                    <Text style={styles.linkAccountButtonText}>Link account</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LinkBinanceAccount

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    inputWrapper: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },
    headerWrapper: {
        alignSelf: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '0%',
        width: '90%',
        marginRight: 20
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
    backButton: {
        marginTop: '10%',
        marginLeft: '3%',
        left: 0,
        top: 0,
        alignSelf: 'flex-start'
    },
    input: {
        width: '100%',
        paddingVertical: 15,
        fontSize: 18,
        marginBottom: 3,
        color: 'white',
    },
    apiKeyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'grey',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 1,
        borderWidth: 1,
        width: '100%',
        marginTop: 0,
        borderRadius: 20
    },
    inputWrapper: {
        width: '90%',
        alignSelf: 'center'
    },
    image: {
        width: '100%',
        height: 70
    },
    credentialsText: {
        color: 'grey',
        fontSize: 20,
        marginTop: 10,
        marginBottom: 10
    },
    linkAccountButton: {
        width: '100%',
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 10
    },
    linkAccountButtonText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    linkAccountButtonWrapper: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 10
    }
})