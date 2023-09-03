import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Image, FlatList } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import React, { useLayoutEffect, useState, useRef, useMemo, useEffect } from 'react'
import { db, auth } from '../../config/Firebase'
import { collection, doc, getDocs, query, onSnapshot } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinkedAccountInfoCard from '../../components/LinkedAccountInfoCard';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const LinkedAccountsMainScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [data, setData] = useState([])
    const [currentlySelectedAccount, setCurrentlySelectedAccount] = useState(null)
    const [image, setImage] = useState(null)
    const bottomSheetModalRef = useRef(null)
    const snapPoints = useMemo(() => ['30%'], [])
    const openModal = ({ item }) => {
        if (item.exchange == 'binance') {
            setImage(require('../../assets/exchange-logos/Binance_Icon.png'))
        }
        setCurrentlySelectedAccount(item)
    }

    useEffect(() => {
        if (currentlySelectedAccount != null) {
            bottomSheetModalRef.current.present()
        }
    }, [currentlySelectedAccount])

    function BottomSheet() {
        return (
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                style={styles.bottomSheet}
                backgroundComponent={() =>
                    <View style={styles.bottomModalBackground} />
                }
                handleComponent={() =>
                    <View style={styles.closeLine}></View>
                }
                enablePanDownToClose
            >
                <View style={styles.bottomSheetContainer}>
                    <View style={styles.info}>
                        <Image style={styles.bottomSheetImage} source={image} />
                        <View>
                            <Text style={styles.bottomSheetText}>name - {currentlySelectedAccount?.name}</Text>
                            <Text style={styles.bottomSheetText}>Exchange - {currentlySelectedAccount?.exchange}</Text>
                            <Text style={styles.bottomSheetText}>Api key - {currentlySelectedAccount?.apiKey.substring(0, 4)}XXXX</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.bottomSheetButton}>
                        <Text style={styles.bottomSheetButtonText}>Remove account</Text>
                    </TouchableOpacity>
                </View>
            </BottomSheetModal>
        )
    }

    useLayoutEffect(() => {
        const q = query(collection(db, 'users', auth.currentUser.uid, 'linkedAccounts'))
        const snapShotUnsubscribe = onSnapshot(q, updatedQuery => {
            setData(updatedQuery.docs.map(item => ({
                name: item.data().name,
                exchange: item.data().exchange,
                apiKey: item.data().apiKey,
            })))
        })

        return snapShotUnsubscribe
    }, [])

    function FlatListHeader() {
        return (
            <>
                <AccountOptions />
                <BottomSheet />
                <View
                    style={styles.backButton}>
                    <IconAntDesign.Button
                        name="left"
                        size={43}
                        backgroundColor={'black'}
                        color="grey"
                        onPress={() => navigation.navigate('MainStack', { screen: 'SettingsScreen' })}
                        borderRadius={50}
                        iconStyle={{ marginRight: 5 }}
                        underlayColor="grey" />
                </View>
                <View style={styles.headerWrapper}>
                    <Text style={styles.titleText}>Add new account</Text>
                    <IconAntDesign.Button
                        name="plus"
                        size={45}
                        backgroundColor={'black'}
                        color="white"
                        style={{ marginRight: -10, }}
                        onPress={() => setModalVisible(true)}
                    />
                </View>
                <View style={styles.separatorLine}></View>
            </>
        )
    }

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
                            <TouchableOpacity style={styles.modalButton} onPress={() => {
                                setModalVisible(false)
                                navigation.navigate('LinkBinanceAccount')
                            }}>
                                <Image style={styles.modalButtonImage} source={require('../../assets/exchange-logos/Binance_Logo.png')} />
                            </TouchableOpacity>
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
        <BottomSheetModalProvider>
            <View style={styles.container}>
                <SafeAreaView>
                    <FlatList
                        keyExtractor={(item) => item.name}
                        data={data}
                        renderItem={({ item }) => (
                            <LinkedAccountInfoCard
                                name={item.name}
                                exchange={item.exchange}
                                apiKey={item.apiKey}
                                onPress={() => openModal({ item })}
                            />
                        )}
                        ListHeaderComponent={<FlatListHeader/>}
                    />
                </SafeAreaView>
            </View>
        </BottomSheetModalProvider>
    )
}

export default LinkedAccountsMainScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    contentWrapper: {
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
        width: '90%'
    },
    titleText: {
        color: 'white',
        fontSize: 33
    },
    separatorLine: {
        width: '90%',
        backgroundColor: 'grey',
        height: 1,
        marginBottom: '3%',
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
    modalButton: {
        paddingVertical: 10,
        width: '100%',
        borderColor: '#1e1e1e',
        borderWidth: 1,
        backgroundColor: '#1e1e1e',
        borderRadius: 10
    },
    modalTextStyle: {
        color: 'white',
        fontWeight: '400',
        textAlign: 'center',
        fontSize: 40,
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
        width: '90%',
        alignItems: 'center',
        marginTop: '5%'
    },
    modalButtonImage: {
        width: '100%',
        height: 70
    },
    bottomSheet: {
        backgroundColor: 'black',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,

        elevation: 19,
    },
    bottomSheetContainer: {
        height: '100%'
    },
    closeLine: {
        alignSelf: 'center',
        width: 40,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'white',
        marginTop: 9,
    },
    bottomModalBackground: {
        ...StyleSheet.absoluteFillObject,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        backgroundColor: '#1e1e1e',
    },
    bottomSheetImage: {
        height: 100,
        width: 100,
        marginRight: 15
    },
    bottomSheetText: {
        color: 'white',
        fontSize: 22
    },
    info: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 30,
    },
    bottomSheetButton: {
        width: '90%',
        borderRadius: 15,
        backgroundColor: 'red',
        padding: 5,
        alignItems: 'center',
        alignSelf: 'center',
        position: 'absolute',
        bottom: 0,
        marginBottom: 30
    },
    bottomSheetButtonText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold'
    }
})