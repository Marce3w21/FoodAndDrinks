import React, { useState, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AirbnbRating, Button, Input } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import { isEmpty } from 'lodash'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import Loading from '../../components/Loading'
import { addDocumentWithoutId, getCurrentUser, getDocumentById, updateDocument } from '../../utils/actions'

export default function AddReviewProduct({ navigation, route }) {
    const { idProduct } = route.params
    const toastRef = useRef()

    const [rating, setRating] = useState(null)
    const [title, setTitle] = useState("")
    const [errorTitle, setErrorTitle] = useState(null)
    const [review, setReview] = useState("")
    const [errorReview, setErrorReview] = useState(null)
    const [loading, setLoading] = useState(false)

    const addReview = async() => {
        if(!validForm()) {
            return
        }

        setLoading(true)
        const user = getCurrentUser()
        const data = {
            idUser: user.uid,
            avatarUser: user.photoURL,
            idProduct,
            title,
            review,
            rating,
            createAt: new Date()
        }

        const responseAddReview = await addDocumentWithoutId("reviews", data)
        if(!responseAddReview.statusResponse) {
            setLoading(false)
            toastRef.current.show("Error al enviar el comentario.", 3000)
            return
        }

        const responseGetProduct = await getDocumentById("products", idProduct)
        if (!responseGetProduct.statusResponse){
            setLoading(false)
            toastRef.current.show("Error al obtener el producto. Por favor, intenta mas tarde.", 3000)
            return
        }

        const product = responseGetProduct.document
        const ratingTotal = product.ratingTotal + rating
        const quantityVoting = product.quantityVoting + 1
        const ratingResult = ratingTotal/quantityVoting
        const responseUpdateProduct = await updateDocument("products", idProduct, {
            ratingTotal,
            quantityVoting,
            rating: ratingResult
        })
        setLoading(false)

        if(!responseUpdateProduct.statusResponse) {
            setLoading(false)
            toastRef.current.show("Error al actualizar el producto. Por favor, intente mas tarde.", 3000)
            return
        }

        navigation.goBack()
    }

    const validForm = () => {
        setErrorTitle(null)
        setErrorReview(null)
        let isValid = true

        if(!rating) {
            toastRef.current.show("Debes darle una puntuacion.", 3000)
            isValid = false
        }

        if(isEmpty(title)) {
            setErrorTitle("Debes ingresar un titulo a tu comentario.")
            isValid = false
        }

        if(isEmpty(review)) {
            setErrorReview("Debes ingresar un comentario.")
            isValid = false
        }

        return isValid
    }

    return (
        <KeyboardAwareScrollView style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={[ "Malo", "Regular", "Normal", "Muy Bueno", "Excelente" ]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value) => setRating(value)}
                />
            </View>
            <View style={styles.formReview}>
                <Input
                    placeholder="Titulo..."
                    containerStyle={styles.input}
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                    errorMessage={errorTitle}
                />
                <Input
                    placeholder="Comentario..."
                    containerStyle={styles.input}
                    style={styles.textArea}
                    multiline
                    onChange={(e) => setReview(e.nativeEvent.text)}
                    errorMessage={errorReview}
                />
                <Button
                    title="Enviar Comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview}
                />
            </View>
            <Toast ref={toastRef} position="top" opacity={0.9}/>
            <Loading isVisible={loading} text="Enviando Comentario."/>
        </KeyboardAwareScrollView>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 30
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 130,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnContainer: {
        flex: 1,
        justifyContent:"flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%"
    },
    btn: {
        backgroundColor: "#721c1c"
    }
})