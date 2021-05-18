import React, { useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import { getTopRestaurants } from '../utils/actions'
import Loading from '../components/Loading'
import ListTopProducts from '../components/ranking/ListTopProducts'

export default function TopProducts({ navigation }) {
    const [products, setProducts] = useState(null)
    const [loading, setLoading] = useState(false)

    console.log(products)
    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getTopRestaurants(7)
                if (response.statusResponse){
                    setProducts(response.products)
                }
                setLoading(false)
            }
            getData()
        }, [])
    )
    
    return (
        <View>
            <ListTopProducts 
                products={products}
                navigation={navigation}
            />
            <Loading isVisible={loading}  text="Por favor, espere..."/>
        </View>
    )
}

const styles = StyleSheet.create({})
