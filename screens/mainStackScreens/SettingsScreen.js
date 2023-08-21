import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import React from 'react'

const SettingsScreen = () => {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.contentWrapper}>
                <Text style={styles.titleText}>Settings</Text>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Log out</Text>
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
        paddingVertical: 15,
        borderWidth: 1,
        borderBottomColor: 'white',
    },
    buttonText: {
        color: 'white',
        fontSize: 22
    },
    titleText: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: '15%',
        marginTop: '10%',
    }
})