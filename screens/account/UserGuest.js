import React from 'react'
import { StyleSheet, ScrollView, Image, Text } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

export default function UserGuest() {
    const navigation = useNavigation()
    
    return (
        <ScrollView
            centerContent
            style={styles.viewBody}
        >
            <Image
                source={require("../../assets/logo1.png")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil en Cusco FoodAndDrinks</Text>
            <Text style={styles.description}>
            Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. 
            </Text>
            <Button
                buttonStyle={styles.button}
                title="Ver tu perfil"
                onPress={() => navigation.navigate("login")}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        marginHorizontal: 30
    },
    image :{
        height: 270,
        width: "100%",
        marginBottom: 10,
    },
    title :{
        fontWeight: "bold",
        fontSize: 19,
        marginVertical: 10,
        textAlign: "center"
    },
    description: {
        textAlign:"center",
        marginBottom: 20,
        color: "#a65273"
    },
    button :{
        backgroundColor: "#721c1c"
    }
})
