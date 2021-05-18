import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

export default function SearchGeneral() {
    const navigation = useNavigation()

    return (
        <ScrollView style={styles.body}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Para poder ayudarte con la busqueda de tu Comida/Bebida
                ideal, tenemos estas opciones para ti:
            </Text>
            <View style={styles.row}>
            <Icon
                    type="material-icons"
                    name="menu-book"
                    size={70}
                    color= "#ff2020"
                    onPress={() => navigation.navigate("search")}
                />
                <Text 
                    style={styles.txt1}
                    onPress={() => navigation.navigate("search")}
                    >
                    Nombre del Producto  
                </Text>
                
            </View>
            <View style={styles.row}>
                <Icon
                    type="material-icons"
                    name="food-bank"
                    size={70}
                    color= "#ff2020"
                    onPress={() => navigation.navigate("search-restaurant")}
                />
                <Text 
                    style={styles.txt1}
                    onPress={() => navigation.navigate("search-restaurant")}
                    >
                    Nombre del Restaurante
                </Text>
            </View>
            <View style={styles.row}>
                <Icon
                    type="material-icons"
                    name="brunch-dining"
                    size={68}
                    color= "#ff2020"
                    onPress={() => navigation.navigate("search-font")}
                />
                <Text 
                    style={styles.txt1}
                    onPress={() => navigation.navigate("search-font")}
                >
                    Tipo de Comida/Bebida/Insumo
                </Text>
            </View>
            <View style={styles.row}>
                <Icon
                    type="material-icons"
                    name="delivery-dining"
                    size={70}
                    color= "#ff2020"
                    onPress={() => navigation.navigate("search-typeattention")}
                />
                <Text 
                    style={styles.txt1}
                    onPress={() => navigation.navigate("search-typeattention")}
                >
                    Tipo de Atencion
                </Text>
            </View>
            <View style={styles.row}>
                <Icon
                    type="material-icons"
                    name="local-atm"
                    size={70}
                    color= "#ff2020"
                    onPress={() => navigation.navigate("search-price")}
                />
                <Text 
                    style={styles.txt1}
                    onPress={() => navigation.navigate("search-price")}
                >
                    Precio
                </Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    body: {
        padding: 15,
        
        flexDirection:'column'
    },
    images: {
        width: 75,
        height: 75,
    },
    row: {
        padding: 10,
        flexDirection: 'row',
        borderColor: "#ff2020",
        borderBottomWidth: 1,
    },
    txt1: {
        marginLeft: 10,
        alignSelf: 'center'
    }
})
