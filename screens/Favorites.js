import React, {useState, useCallback } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {Button, Icon} from 'react-native-elements'
import { useFocusEffect} from '@react-navigation/native'
import { getFavorites } from '../utils/actions'
import Toast from 'react-native-easy-toast'
import firebase from 'firebase/app'

export default function Favorites( navigation ) {
    const toastRef = useRef()
    const [products, setProducts] = useState(null)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [reloadData, setReloadData] = useState(false)

    firebase.auth().onAuthStateChanged((user) =>{
        user ? setUserLogged(true) : setUserLogged(false)
    })

    useFocusEffect(
        useCallback(() => {
            async function getData() {
                setLoading(true)
                const response = await getFavorites()
                setProducts(response.favorites)
                setLoading(false)
            }
            getData()
         }, [])
    )  
    return (
        <View>
            <Text>Favorites</Text>
        </View>
    )
}

const styles = StyleSheet.create({})
