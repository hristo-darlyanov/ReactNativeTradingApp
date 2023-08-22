import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { default as IconMaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react'

const SettingsScreen = () => {
    function LeftPointingArrow() {
        return (
            <IconAntDesign
                name="right"
                size={27}
                backgroundColor={'black'}
                color="white"
                style={{ marginRight: 5 }}
                onPress={() => { }}
            />
        )
    }

    return (
        <View style={styles.container}>
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
                <TouchableOpacity style={styles.button}>
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
    }
})