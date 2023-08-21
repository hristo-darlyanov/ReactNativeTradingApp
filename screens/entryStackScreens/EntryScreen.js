import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { LineChart } from 'react-native-wagmi-charts';
import React from 'react'
import data from '../../assets/data/EntryScreenData'

const EntryScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleWrapper}>
                <Text style={styles.titleText}>aissac trade</Text>
            </View>
            <View style={styles.chart}>
                <LineChart.Provider data={data}>
                    <LineChart>
                        <LineChart.Path color='white' />
                    </LineChart>
                </LineChart.Provider>
            </View>
            <View style={styles.introWrapper}>
                <Text style={styles.introTitleText}>AI trading</Text>
                <Text style={styles.introDescriptionText}>Trading in the crypto market with tools like never before</Text>
            </View>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate('LoginScreen')}>
                    <Text style={styles.loginButtonText}>Log in</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'white' }} />
                    <View>
                        <Text style={{ width: 50, textAlign: 'center', color: 'white' }}>or</Text>
                    </View>
                    <View style={{ flex: 1, height: 1, backgroundColor: 'white' }} />
                </View>
                <TouchableOpacity
                    style={styles.signUpButton}
                    onPress={() => navigation.navigate('SignUpScreen')}>
                    <Text style={styles.singUpButtonText}>Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default EntryScreen

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        alignItems: 'center'
    },
    titleWrapper: {
        justifyContent: 'space-evenly',
        marginTop: '10%',
        width: '100%'
    },
    titleText: {
        color: 'white',
        fontSize: 25,
        marginLeft: '7%',
    },
    buttonWrapper: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '90%'
    },
    loginButton: {
        backgroundColor: 'white',
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 10
    },
    loginButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold'
    },
    signUpButton: {
        backgroundColor: 'black',
        width: '100%',
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'white',
        borderWidth: 2,
        marginBottom: '7%',
        borderRadius: 10
    },
    singUpButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold'
    },
    introWrapper: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 30,
        width: '90%',
    },
    introTitleText: {
        color: 'white',
        fontSize: 30,
    },
    introDescriptionText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '300'
    },
    line: {
        backgroundColor: 'white',
        height: 1,
        marginLeft: '7%',
        marginRight: '46%'
    },
    chart: {
        width: '100%'
    }
})