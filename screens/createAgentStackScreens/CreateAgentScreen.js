import { StyleSheet, Text, View, Animated, Keyboard } from 'react-native'
import { default as IconAntDesign } from 'react-native-vector-icons/AntDesign';
import { CreateAgentTabContext } from '../../components/PublicContexts';
import React, { useRef, useContext } from 'react'

const CreateAgentScreen = () => {
    const { isCreatingAgent, setIsCreatingAgent } = useContext(CreateAgentTabContext)
    const fadeAnim = useRef(new Animated.Value(1)).current;

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

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.backButton, { opacity: fadeAnim }]}>
                <IconAntDesign.Button
                    name="left"
                    size={43}
                    backgroundColor={'black'}
                    color="white"
                    onPress={() => setIsCreatingAgent(false)}
                    borderRadius={50}
                    iconStyle={{ marginRight: -5 }}
                    underlayColor="grey" />
            </Animated.View>
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
        flex: 1,
        position: 'absolute',
        left: 0,
        top: 0,
    },
})