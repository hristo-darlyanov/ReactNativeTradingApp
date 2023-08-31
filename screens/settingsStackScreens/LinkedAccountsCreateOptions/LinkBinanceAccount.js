import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Keyboard, Modal } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconOcticons } from 'react-native-vector-icons/Octicons';
import React, { useState } from 'react'
import CryptoJS from 'crypto-js';
import { AccountInformationFutures } from '../../../BinanceAccountController';

const LinkBinanceAccount = ({ navigation }) => {
    const keyboardShowListener = Keyboard.addListener(
        'keyboardDidShow',
        () => {
            setAreCredentialsValid(0)
        }
    );

    const [areCredentialsValid, setAreCredentialsValid] = useState(0)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false)
    const [buttonProps, setButtonProps] = useState({ backgroundColor: 'white', borderColor: 'white', })
    const [buttonMessage, setButtonMessage] = useState('Link account')
    const [name, setName] = useState('')
    const [apiKey, setApiKey] = useState('3eb009ef8688a5bbba240bf9cfabdf090f0d6c20f61695a4e25a97310621a16b')
    const [apiSecret, setApiSecret] = useState('fd54011c3e4b75091690389240fbbd30a952b520c3087134641dabfbb2fe95cb')
    const [modalVisible, setModalVisible] = useState(false);

    const handleLinkingAccount = async () => {
        setAreCredentialsValid(0)
        await AccountInformationFutures(apiKey, apiSecret)
            .then(data => {
                const temp = data.assets[0].asset
                setIsButtonDisabled(true)
                setButtonProps({ backgroundColor: 'grey', borderColor: 'grey' })
                setButtonMessage('Done!')
                setModalVisible(true)
            })
            .catch(error => {
                setAreCredentialsValid(1)
            })
    }
    function DoneMessage() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Account linked successfully</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => {
                            setModalVisible(false)
                            navigation.goBack()
                        }}>
                            <Text style={styles.modalButtonText}>Go back</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <View style={styles.container}>
            <DoneMessage />
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
            <View style={[styles.inputWrapper, { marginBottom: 20 }]}>
                <Text style={styles.credentialsText}>Enter name for the account:</Text>
                <View style={styles.apiKeyContainer}>
                    <IconOcticons
                        name="pencil"
                        size={30}
                        color="white"
                        style={{ marginRight: 10, marginLeft: 20 }} />
                    <TextInput
                        style={styles.input}
                        placeholderTextColor='grey'
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={name}
                        onChangeText={(text) => setName(text)} />
                </View>
            </View>
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
                <TouchableOpacity style={[styles.linkAccountButton, { ...buttonProps }]} onPress={handleLinkingAccount} disabled={isButtonDisabled}>
                    <Text style={styles.linkAccountButtonText}>{buttonMessage}</Text>
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
        flex: 1,
        marginRight: 10
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
        paddingVertical: 10,
        marginTop: 20
    },
    linkAccountButtonText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    linkAccountButtonWrapper: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 10
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        backgroundColor: 'black',
        borderRadius: 10,
        borderColor: 'grey',
        borderWidth: 1,
        width: '93%',
        height: '20%',
        alignItems: 'center',
    },
    modalText: {
        color: 'white',
        fontSize: 27,
        marginTop: 20
    },
    modalButton: {
        width: '90%',
        padding: 5,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 5,
        backgroundColor: 'white',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        marginBottom: 20
    },
    modalButtonText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
})