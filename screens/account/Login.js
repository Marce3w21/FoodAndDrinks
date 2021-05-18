import React from 'react'
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native'
import { Divider } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import LoginForm from '../../components/account/LoginForm'

export default function Login() {
    return (
       <KeyboardAwareScrollView>
           <Image
                source={require("../../assets/logo1.png")}
                resizeMode="contain"
                style={styles.image}
           />
           <View style={styles.container}>
               <LoginForm/>
               <CreateAccount/>
               <RecoverPasswordFun/>
           </View>
           <Divider style={styles.divider}/>
       </KeyboardAwareScrollView>
    )
}

function RecoverPasswordFun() {
    const navigation = useNavigation()

    return (
        <Text
            style={styles.register}
            onPress={() => navigation.navigate("recover-password")}
        >
            ¿Olvidaste tu contraseña?{" "}
        <Text style={styles.btnRegister}>
            Recupérala
        </Text>
        </Text>
    )
}

function CreateAccount(props){
    const navigation = useNavigation()
    return(
        <Text 
            style={styles.register}
            onPress={() => navigation.navigate("register")}
        >
            Aun no tienes una cuenta?{" "}
            <Text style={styles.btnRegister}>
                Registrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 220,
        width: "100%",
        marginBottom: 1,
        marginTop: 15
    },
    container: {
        marginHorizontal: 40
    },
    divider: {
        backgroundColor: "#ff2020",
        margin: 30
    },
    register:{
        marginTop: 15,
        marginHorizontal: 10,
        alignSelf: "center"
    },
    btnRegister: {
        color: "#ff2020",
        fontWeight: "bold"
    }
})
