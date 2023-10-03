import { StyleSheet, Text, View, Animated, Keyboard, TouchableOpacity, Modal, Image, TextInput } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { CreateAgentTabContext } from '../../components/PublicContexts';
import { db, auth } from '../../config/Firebase'
import { AccountInformationFutures } from '../../BinanceAccountController';
import { query, onSnapshot, collection, addDoc, where } from 'firebase/firestore';
import React, { useRef, useContext, useState, useLayoutEffect } from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import LinkedAccountInfoCard from '../../components/LinkedAccountInfoCard';

const binanceIcon = require('../../assets/exchange-logos/Binance_Icon.png')

const CreateAgentScreen = () => {
    const [accountOptionsModalVisible, setAccountOptionsModalVisible] = useState(false)
    const [confirmCreatingAgentModalVisible, setConfirmCreatingAgentModalVisible] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [data, setData] = useState([])
    const [availableUSDT, setAvailableUSDT] = useState(0)
    const [amountOfPercentagePerTrade, setAmountOfPercentagePerTrade] = useState('')
    const [USDTToUse, setUSDTToUse] = useState('')
    const [accountErrorMessage, setAccountErrorMessage] = useState('')
    const [USDTUsageErrorMessage, setUSDTUsageErrorMessage] = useState('')
    const [percentageErrorMessage, setPercentageErrorMessage] = useState('')
    const [agentData, setAgentData] = useState([])
    const { isCreatingAgent, setIsCreatingAgent } = useContext(CreateAgentTabContext)
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [image, setImage] = useState(null)

    function ValidInput() {
        const passedTests = []
        if (selectedAccount) {
            passedTests.push(true)
        } else {
            passedTests.push(false)
            setAccountErrorMessage('Choose an account')
            return passedTests.every(Boolean)
        }

        if (USDTToUse != '') {
            try {
                let num = parseFloat(USDTToUse)
                if (num > availableUSDT) {
                    passedTests.push(false)
                    setUSDTUsageErrorMessage('Insufficient balance')
                }
            } catch (error) {
                passedTests.push(false)
            }
        } else {
            passedTests.push(false)
            setUSDTUsageErrorMessage('Select amount')
        }

        if (amountOfPercentagePerTrade != '') {
            try {
                let num = parseFloat(amountOfPercentagePerTrade)
                if (num > 5) {
                    passedTests.push(false)
                    setPercentageErrorMessage("Percentage can't be bigger than 5%")
                }
            } catch (error) {
                passedTests.push(false)
            }
        } else {
            passedTests.push(false)
            setPercentageErrorMessage('Select amount')
        }

        if (!agentData.some(agent => agent.agentName == selectedAccount.name)) {
            console.log(selectedAccount.name)
            passedTests.push(true)
        } else {
            setAccountErrorMessage('Agent associated with this account already exists')
            passedTests.push(false)
        }

        return passedTests.every(Boolean)
    }

    const handleConfirmation = () => {
        setAccountErrorMessage('')
        setUSDTUsageErrorMessage('')
        setPercentageErrorMessage('')
        if (ValidInput()) {
            setConfirmCreatingAgentModalVisible(true)
        }
    }

    async function CreateAgentForUser() {
        setConfirmCreatingAgentModalVisible(false)
        await addDoc(collection(db, 'agents'), {
            dateOfCreation: Date.now(),
            associatedAccountName: selectedAccount.name,
            associatedAccountUserId: auth.currentUser.uid,
            usdtToUse: parseFloat(USDTToUse),
            percentagePerTrade: parseFloat(amountOfPercentagePerTrade),
            position: 'hold',
            apiKey: selectedAccount.apiKey,
            apiSecret: selectedAccount.apiSecret,
            exchange: selectedAccount.exchange
        })
            .then(() => {
                setIsCreatingAgent(false)
                console.log("Added agent successfully")
            })
            .catch(error => console.log(error))
    }

    const handleAccountSelection = async ({ item }) => {
        if (item.exchange == 'binance') {
            setImage(binanceIcon)
        }
        setSelectedAccount(item)
        setAccountOptionsModalVisible(false)
        await AccountInformationFutures(item.apiKey, item.apiSecret)
            .then((data) => {
                const usdtInfo = data.assets.find(x => x.asset == 'USDT')
                setAvailableUSDT(usdtInfo.availableBalance)
                setUSDTToUse(usdtInfo.availableBalance)
                setAccountErrorMessage('')
            })
    }

    useLayoutEffect(() => {
        const q = query(collection(db, 'agents'), where('associatedAccountUserId', '==', auth.currentUser.uid))
        const snapShotUnsubscribe = onSnapshot(q, updatedQuery => {
            setAgentData(updatedQuery.docs.map(item => ({
                associatedUser: item.data().associatedAccountUserId,
                agentName: item.data().associatedAccountName,
                id: item.id
            })))
        })

        return snapShotUnsubscribe
    }, [])

    useLayoutEffect(() => {
        const q = query(collection(db, 'users', auth.currentUser.uid, 'linkedAccounts'))
        const snapShotUnsubscribe = onSnapshot(q, updatedQuery => {
            setData(updatedQuery.docs.map(item => ({
                name: item.data().name,
                exchange: item.data().exchange,
                apiKey: item.data().apiKey,
                apiSecret: item.data().apiSecret
            })))
        })

        return snapShotUnsubscribe
    }, [])

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

    function AccountOptionsModal() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={accountOptionsModalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setAccountOptionsModalVisible(!accountOptionsModalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { height: '60%' }]}>
                        <View style={styles.modalButtonWrapper}>
                            <FlatList
                                keyExtractor={(item) => item.name}
                                data={data}
                                renderItem={({ item }) => (
                                    <LinkedAccountInfoCard
                                        name={item.name}
                                        exchange={item.exchange}
                                        apiKey={item.apiKey}
                                        onPress={() => handleAccountSelection({ item })}
                                    />
                                )}
                            />
                        </View>
                        <TouchableOpacity style={styles.modalBackButton} onPress={() => setAccountOptionsModalVisible(false)}>
                            <Text style={styles.modalBackButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    function ConfirmCreatingAgentModal() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={confirmCreatingAgentModalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setConfirmCreatingAgentModalVisible(!confirmCreatingAgentModalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={[styles.modalView, { height: '48%' }]}>
                        <View style={styles.modalConfirmInfoWrapper}>
                            <Text style={styles.modalDescriotion}>Are you sure you want to create agent with the following parameters:</Text>
                            <View style={styles.infoWrapper}>
                                <Text style={styles.infoMessage}>Associated account - </Text>
                                <Text style={styles.infoValue}>{selectedAccount?.name}</Text>
                            </View>
                            <View style={styles.infoWrapper}>
                                <Text style={styles.infoMessage}>USDT to use - </Text>
                                <Text style={styles.infoValue}>${parseFloat(USDTToUse).toFixed(2)}</Text>
                            </View>
                            <View style={styles.infoWrapper}>
                                <Text style={styles.infoMessage}>Percentage to use per trade - </Text>
                                <Text style={styles.infoValue}>{amountOfPercentagePerTrade}%</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.modalConfirmButton} onPress={() => CreateAgentForUser()}>
                            <Text style={styles.modalConfirmButtonText}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalUnanchoredBackButton} onPress={() => setConfirmCreatingAgentModalVisible(false)}>
                            <Text style={styles.modalBackButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <AccountOptionsModal />
            <ConfirmCreatingAgentModal />
            <Animated.View
                style={[styles.backButton, { opacity: fadeAnim }]}>
                <IconAntDesign.Button
                    name="left"
                    size={43}
                    backgroundColor={'black'}
                    color="white"
                    onPress={() => setIsCreatingAgent(false)}
                    borderRadius={50}
                    iconStyle={{ marginRight: 5 }}
                    underlayColor="grey" />
            </Animated.View>
            <View style={styles.headerWrapper}>
                <Text style={styles.titleText}>Create agent</Text>
            </View>
            <View style={styles.separatorLine}></View>
            <View style={styles.contentWrapper}>
                <Text style={styles.text}>Choose account:</Text>
                <TouchableOpacity style={styles.chooseAccountButton} onPress={() => setAccountOptionsModalVisible(true)}>
                    <Image style={styles.image} source={image} />
                    <Text style={styles.chooseAccountText}>{selectedAccount ? selectedAccount.name : 'none'}</Text>
                </TouchableOpacity>
                <Text style={{ color: 'red', marginTop: 5, alignSelf: 'flex-start' }}>{accountErrorMessage}</Text>
            </View>
            <View style={[styles.contentWrapper, { marginTop: 20 }]}>
                <Text style={styles.text}>Max amount of USDT usage:</Text>
                <TextInput
                    inputMode='decimal'
                    defaultValue={`${USDTToUse}`}
                    style={styles.input}
                    placeholderTextColor='grey'
                    placeholder={`Max amount: ${availableUSDT}`}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={`${USDTToUse}`}
                    onChangeText={(text) => setUSDTToUse(text)} />
                <Text style={{ color: 'red', marginTop: 5, alignSelf: 'flex-start' }}>{USDTUsageErrorMessage}</Text>
            </View>
            <View style={[styles.contentWrapper, { marginTop: 20 }]}>
                <Text style={styles.text}>USDT amount to use per trade in %:</Text>
                <TextInput
                    inputMode='decimal'
                    style={styles.input}
                    placeholderTextColor='grey'
                    placeholder={`Max percentage: 5%`}
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={`${amountOfPercentagePerTrade}`}
                    onChangeText={(text) => setAmountOfPercentagePerTrade(text)} />
                <Text style={{ color: 'red', marginTop: 5, alignSelf: 'flex-start' }}>{percentageErrorMessage}</Text>
            </View>
            <TouchableOpacity style={styles.openModalButton} onPress={handleConfirmation}>
                <Text style={styles.openModalButtonText}>Create agent</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

export default CreateAgentScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    backButton: {
        marginTop: '10%',
        marginLeft: '3%',
        left: 0,
        top: 0,
        alignSelf: 'flex-start'
    },
    separatorLine: {
        width: '90%',
        backgroundColor: 'grey',
        height: 1,
        marginBottom: '3%',
        marginTop: '2%',
        alignSelf: 'center'
    },
    headerWrapper: {
        width: '90%',
        alignItems: 'center',
        alignSelf: 'center'
    },
    titleText: {
        color: 'white',
        fontSize: 40
    },
    contentWrapper: {
        width: '90%',
        alignSelf: 'center'
    },
    text: {
        color: 'grey',
        fontSize: 28
    },
    chooseAccountText: {
        color: 'white',
        fontSize: 25,
        marginLeft: 10,
    },
    chooseAccountButton: {
        width: '100%',
        padding: 5,
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        marginTop: '3%',
        paddingVertical: 13,
        alignItems: 'center',
        flexDirection: 'row'
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
        width: '90%',
        alignItems: 'center',
    },
    modalBackButton: {
        position: 'absolute',
        bottom: 0,
        width: '90%',
        marginBottom: '4%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e1e1e',
        borderRadius: 7,
        backgroundColor: '#1e1e1e',
        marginTop: '4%'
    },
    modalBackButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: '300'
    },
    modalButtonWrapper: {
        width: '100%',
        marginTop: '5%'
    },
    image: {
        width: 30,
        height: 30,
        marginLeft: 10
    },
    input: {
        padding: 5,
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        marginTop: '3%',
        paddingVertical: 13,
        color: 'white',
        fontSize: 25,
        paddingHorizontal: 20
    },
    openModalButton: {
        alignItems: 'center',
        alignSelf: 'center',
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: '5%',
        paddingVertical: 10
    },
    openModalButtonText: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    },
    modalConfirmInfoWrapper: {
        width: '90%',
        alignSelf: 'center'
    },
    modalDescriotion: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: '5%',
        marginBottom: '5%'
    },
    infoWrapper: {
        flexDirection: 'row',
        marginTop: 5,
        margin: 5,
        alignItems: 'center'
    },
    infoMessage: {
        color: 'grey',
        fontSize: 22
    },
    infoValue: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22
    },
    modalConfirmButton: {
        width: '90%',
        backgroundColor: 'white',
        paddingVertical: 7,
        borderRadius: 10,
        marginTop: '5%',
        alignItems: 'center'
    },
    modalConfirmButtonText: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    modalUnanchoredBackButton: {
        width: '90%',
        marginBottom: '4%',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1e1e1e',
        borderRadius: 7,
        backgroundColor: '#1e1e1e',
        marginTop: '4%'
    },
})