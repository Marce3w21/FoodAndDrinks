import { firebaseApp } from './firebase'
import firebase from 'firebase'
import 'firebase/firestore'
require('firebase/firestore')

import { fileToBlob } from './helpers'

const db = firebase.firestore(firebaseApp)

export const isUserLogged = () =>{
    let isLogged = false
    firebase.auth().onAuthStateChanged((user) =>{
        user !== null && (isLogged = true)
    })
    return isLogged
}

export const getCurrentUser = () =>{
    return firebase.auth().currentUser
}

export const closeSession = () =>{
    return firebase.auth().signOut()
}

export const registerUser = async(email, password) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Este correo ya ha sido registrado."
    }
    return result
}

export const loginWithEmailAndPassword = async(email, password) => {
    const result = { statusResponse: true, error: null }
    try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
    } catch (error) {
        result.statusResponse = false
        result.error = "Usuario o contraseña no validos."
    }
    return result
}

export const uploadImage = async(image, path, name) =>{
    const result = { statusResponse:false, error: null, url: null }
    const ref = firebase.storage().ref(path).child(name)
    const blob = await fileToBlob(image)
    
    try {
        await ref.put(blob)
        const url = await firebase.storage().ref(`${path}/${name}`).getDownloadURL()
        result.statusResponse = true
        result.url = url
    } catch (error) {
        result.error = error
    }
    return result
}

export const updateProfile = async(data) => {
    const result = {  statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateProfile(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const reauthenticate = async(password) => {
    const result = {  statusResponse: true, error: null }
    const user = getCurrentUser()
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password)
    try {
        await user.reauthenticateWithCredential(credentials)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updateEmail = async(email) => {
    const result = {  statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updateEmail(email)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const updatePassword = async(password) => {
    const result = {  statusResponse: true, error: null }
    try {
        await firebase.auth().currentUser.updatePassword(password)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result
}

export const addDocumentWithoutId = async(collection, data) => {
    const result = { statusResponse: true, error: null }
    try {
        await db.collection(collection).add(data)
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}



export const getProducts = async(limitProducts) => {
    const result = { statusResponse: true, error: null, products: [], startProduct: null }
    try {
        const response = await db
            .collection("products")
            .orderBy("createAt", "desc")
            .limit(limitProducts)
            .get()
        if (response.docs.length > 0){
            result.startProduct = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const product = doc.data()
            product.id = doc.id
            result.products.push(product)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getMoreProducts = async(limitProducts, startProduct) => {
    const result = { statusResponse: true, error: null, products: [], startProducts: null }
    try {
        const response = await db
            .collection("products")
            .orderBy("createAt", "desc")
            .startAfter(startProduct.data().createAt)
            .limit(limitProducts)
            .get()
        if (response.docs.length > 0){
            result.startProduct = response.docs[response.docs.length - 1]
        }
        response.forEach((doc) => {
            const product = doc.data()
            product.id = doc.id
            result.products.push(product)
        })
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}

export const getDocumentById = async(collection, id) => {
    const result = { statusResponse: true, error: null, document: null }
    try {
        const response = await db.collection(collection).doc(id).get()
        result.document = response.data()
        result.document.id =  response.id
    } catch (error) {
        result.statusResponse = false
        result.error = error
    }
    return result     
}