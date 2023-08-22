import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, Pressable } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconMaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/Firebase';
import LeftPointingArrow from '../../components/LeftPointingArrow';
import React, { useState } from 'react'

const SettingsScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);

    const handleSignOut = () => {
        signOut(auth).then(() => {
            console.log("Sign out successful")
        }).catch((error) => {
            console.log(error.message)
        });
    }

    function LogoutModal() {
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
                        <View style={styles.modalDescriptionTextWrapper}>
                            <Text style={styles.modalDescriptionText}>Are you sure you want to log out? You can always log in later</Text>
                        </View>
                        <View style={styles.modalButtonWrapper}>
                            <TouchableOpacity
                                style={styles.modalLogoutButton}
                                onPress={handleSignOut}>
                                <Text style={styles.modalTextStyle}>Log out</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.modalTextStyle}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    return (
        <View style={styles.container}>
            <LogoutModal />
            <ScrollView contentContainerStyle={styles.contentWrapper}>
                <Text style={styles.titleText}>Settings</Text>

                {/* Account section */}

                <View style={styles.separatorTitleWrapper}>
                    <IconMaterialCommunityIcons
                        name="account-outline"
                        size={30}
                        backgroundColor={'black'}
                        color="white"
                        style={{ marginRight: 5 }}
                        onPress={() => { }}
                    />
                    <Text style={styles.sectionTitle}>Account</Text>
                </View>
                <View style={styles.separatorLine}></View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Edit profile</Text>
                    <LeftPointingArrow />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Change password</Text>
                    <LeftPointingArrow />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Linked accounts</Text>
                    <LeftPointingArrow />
                </TouchableOpacity>

                {/* MORE section */}
                <View style={styles.separatorTitleWrapper}>
                    <IconMaterialCommunityIcons
                        name="sticker-plus-outline"
                        size={30}
                        backgroundColor={'black'}
                        color="white"
                        style={{ marginRight: 5 }}
                        onPress={() => { }}
                    />
                    <Text style={styles.sectionTitle}>More</Text>
                </View>
                <View style={styles.separatorLine}></View>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>About</Text>
                    <LeftPointingArrow />
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Log out</Text>
                    <LeftPointingArrow />
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}

export default SettingsScreen

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
    button: {
        width: '90%',
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonText: {
        color: '#919191',
        fontSize: 24,
        fontWeight: '300'
    },
    titleText: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: '5%',
        marginTop: '20%',
        marginBottom: '5%'
    },
    separatorLine: {
        width: '90%',
        backgroundColor: 'grey',
        height: 1,
        marginBottom: '2%',
        marginTop: '2%'
    },
    sectionTitle: {
        color: 'white',
        fontSize: 25,
        alignSelf: 'flex-start',
    },
    separatorTitleWrapper: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '2%'
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
        height: '20%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalLogoutButton: {
        borderRadius: 10,
        paddingVertical: 10,
        width: '47%',
        backgroundColor: 'red'
    },
    modalCloseButton: {
        borderRadius: 10,
        paddingVertical: 10,
        width: '47%',
        backgroundColor: '#1e1e1e'
    },
    modalButtonWrapper: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        justifyContent: 'space-between',
        marginBottom: 10
    },
    modalTextStyle: {
        color: 'white',
        fontWeight: '400',
        textAlign: 'center',
        fontSize: 20
    },
    modalDescriptionText: {
        color: 'white',
        fontSize: 22,
        textAlign: 'center',
        marginTop: '7%',
    },
    modalDescriptionTextWrapper: {
        width: '90%'
    }
})