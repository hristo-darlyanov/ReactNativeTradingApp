import { StyleSheet, Text, View, ScrollView, Modal, TouchableOpacity, Image } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import React, { useState } from 'react'

const LinkedAccountsMainScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
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
                            <TouchableOpacity style={styles.modalButton}>
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
        <View style={styles.container}>
            <AccountOptions />
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
            <ScrollView contentContainerStyle={styles.contentWrapper}>
            </ScrollView>
        </View>
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
    }
})