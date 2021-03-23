import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import { size } from 'lodash'

import Loading from '../../components/Loading'
import { getMoreProducts, getProducts } from '../../utils/actions'
import ListProducts from '../../components/products/ListProducts'

export default function Products({ navigation }) {
    const [user, setUser] = useState(null)
    const [startProduct, setStartProduct] = useState(null)
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    //const correo = "1234@yopmail.com"

    const limitProducts = 6
    console.log("products", products)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            //Habilitar boton xd
            userInfo ? setUser(true) : setUser(false)
        })  
    }, [])

    useFocusEffect(
        useCallback(async() => {
                setLoading(true)
                const response = await getProducts(limitProducts)
                if (response.statusResponse) {
                    setStartProduct(response.startProduct)
                    setProducts(response.products)
                }
                setLoading(false)
            },[],
        )
    )

    const handleLoadMore = async() => {
        if (!startProduct){
            return
        }

        setLoading(true)
        const response = await getMoreProducts(limitProducts, startProduct)
                if (response.statusResponse) {
                    setStartProduct(response.startProduct)
                    setProducts([...products, ...response.products])
                }
        setLoading(false)
    }

    if(user === null){
        return <Loading isVisible={true} text="Cargando..."/>
    }

    return (
        <View style={styles.view}>
            {
                size(products) > 0 ? (
                    <ListProducts
                        products={products}
                        navigation={navigation}
                        handleLoadMore ={handleLoadMore}
                    />
                ): (
                    <View style={styles.notFoundView}>
                        <Text style={styles.notFoundText}>No hay productos registrados.</Text>
                    </View>
                )
            }
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
            <Loading isVisible={loading} text="Cargando productos..."/> 
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
    },
    notFoundView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }, 
    notFoundText: {
        fontSize: 18,
        fontWeight: "bold"
    }
})
