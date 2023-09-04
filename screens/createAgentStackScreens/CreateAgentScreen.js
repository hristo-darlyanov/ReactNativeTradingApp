import { StyleSheet, Text, View, Animated, Keyboard, TouchableOpacity, Modal, Image } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { CreateAgentTabContext } from '../../components/PublicContexts';
import { db, auth } from '../../config/Firebase'
import { query, onSnapshot, collection } from 'firebase/firestore';
import React, { useRef, useContext, useState, useLayoutEffect } from 'react'
import { FlatList } from 'react-native-gesture-handler';
import LinkedAccountInfoCard from '../../components/LinkedAccountInfoCard';

const binanceIcon = require('../../assets/exchange-logos/Binance_Icon.png')

const CreateAgentScreen = () => {
    const [modalVisible, setModalVisible] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState('none')
    const [data, setData] = useState([])
    const { isCreatingAgent, setIsCreatingAgent } = useContext(CreateAgentTabContext)
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const [image, setImage] = useState(null)

    const handleAccountSelection = ({item}) => {
        if (item.exchange == 'binance') {
            setImage(binanceIcon)
        }
        setSelectedAccount(item.name)
        setModalVisible(false)
    }

    useLayoutEffect(() => {
        const q = query(collection(db, 'users', auth.currentUser.uid, 'linkedAccounts'))
        const snapShotUnsubscribe = onSnapshot(q, updatedQuery => {
            setData(updatedQuery.docs.map(item => ({
                name: item.data().name,
                exchange: item.data().exchange,
                apiKey: item.data().apiKey,
                id: item.id
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

    function AfterChosenAccountOptions() {
        return (
            <View>
                <Text style={styles.text}>hello</Text>
            </View>
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
                    <Image style={styles.image} source={image}/>
                    <Text style={styles.chooseAccountText}>{selectedAccount}</Text>
                </TouchableOpacity>
            </View>
            { selectedAccount != 'none' ? <AfterChosenAccountOptions/> : <View></View>}
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
        color: 'white',
        fontSize: 30
    },
    chooseAccountText: {
        color: 'grey',
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
    }
})