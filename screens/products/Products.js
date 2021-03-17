import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase/app'

import Loading from '../../components/Loading'

export default function Products({ navigation }) {
    const [user, setUser] = useState(null)
    //const correo = "1234@yopmail.com"

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            //Habilitar boton xd
            userInfo ? setUser(true) : setUser(false)
        })  
    }, [])

    if(user === null){
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.view}>
            <Text>Products</Text>
            {
                user && (
                <Icon
                type="material-community"
                name="plus"
                color="#721c1c"
                reverse
                containerStyle={styles.btnContainer}
                onPress={() => navigation.navigate("add-products")}
                />  
                )
            } 
        </View>
    )
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
    },
    btnContainer: {
        position: "absolute",
        bottom: 10,
        right: 10,
        shadowColor: "black",
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.5
    }
})
