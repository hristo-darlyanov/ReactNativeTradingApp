import { StyleSheet, Text, View, Animated, Keyboard, TouchableOpacity, Modal, Image, TextInput } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { CreateAgentTabContext } from '../../components/PublicContexts';
import { db, auth } from '../../config/Firebase'
import { query, onSnapshot, collection } from 'firebase/firestore';
import React, { useRef, useContext, useState, useLayoutEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import LinkedAccountInfoCard from '../../components/LinkedAccountInfoCard';
import { AccountInformationFutures } from '../../BinanceAccountController';

const binanceIcon = require('../../assets/exchange-logos/Binance_Icon.png')

const CreateAgentScreen = () => {
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(null)
    const [data, setData] = useState([])
    const [availableUSDT, setAvailableUSDT] = useState(0)
    const [amountOfUSDTPerTrade, setAmountOfUSDTPerTrade] = useState('')
    const [USDTToUse, setUSDTToUse] = useState('')
    const { isCreatingAgent, setIsCreatingAgent } = useContext(CreateAgentTabContext)
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [image, setImage] = useState(null)

    function ValidateInput() {

    }

    const handleAccountSelection = async ({ item }) => {
        if (item.exchange == 'binance') {
            setImage(binanceIcon)
        }
        setSelectedAccount(item)
        setModalVisible(false)
        await AccountInformationFutures(item.apiKey, item.apiSecret)
            .then((data) => {
                const usdtInfo = data.assets.find(x => x.asset == 'USDT')
                setAvailableUSDT(usdtInfo.availableBalance)
                setUSDTToUse(usdtInfo.availableBalance)
            })
    }

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

    function AccountOptions() {
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
                        <TouchableOpacity style={styles.modalBackButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalBackButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <View style={styles.container}>
            <AccountOptions />
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
                <TouchableOpacity style={styles.chooseAccountButton} onPress={() => setModalVisible(true)}>
                    <Image style={styles.image} source={image} />
                    <Text style={styles.chooseAccountText}>{selectedAccount ? selectedAccount.name : 'none'}</Text>
                </TouchableOpacity>
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
                    value={`${amountOfUSDTPerTrade}`}
                    onChangeText={(text) => setAmountOfUSDTPerTrade(text)} />
            </View>
            <TouchableOpacity style={styles.openModalButton}>
                <Text style={styles.openModalButtonText}>Create agent</Text>
            </TouchableOpacity>
        </View>
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
        height: '60%',
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
        backgroundColor: '#1e1e1e'
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
        marginTop: '15%',
        paddingVertical: 10
    },
    openModalButtonText: {
        color: 'black',
        fontSize: 30,
        fontWeight: 'bold',
    }
})