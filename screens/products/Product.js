import React, { useState, useCallback, useRef, useEffect } from 'react'
import { ScrollView, Alert, Dimensions, StyleSheet, Text, View } from 'react-native'
import { Button, Icon, Input, ListItem, Rating } from 'react-native-elements'
import { isEmpty, map } from 'lodash'
import { useFocusEffect } from '@react-navigation/native'
import firebase from 'firebase/app'
import Toast from 'react-native-easy-toast'

import CarouselImages from '../../components/CarouselImages'
import Loading from '../../components/Loading'
import Modal from '../../components/Modal'
import MapRestaurant from '../../components/products/MapRestaurant'
import { addDocumentWithoutId, getCurrentUser, getDocumentById, getIsFavorite, deleteFavorite, setNotificationMessage, sendPushNotification, getUsersFavorite } from '../../utils/actions'
import { callNumber, formatPhone, sendWhatsApp } from '../../utils/helpers'
import ListReviews from '../../components/products/ListReviews'

const widthScreen = Dimensions.get("window").width

export default function Product({ navigation, route }) {
    const { id, nameProduct } = route.params
    const toastRef = useRef()

    const [product, setProduct] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)
    const [isFavorite, setIsFavorite] = useState(false)
    const [userLogged, setUserLogged] = useState(false)
    const [loading, setLoading] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const [modalNotification, setModalNotification] = useState(false)

    firebase.auth().onAuthStateChanged(user => {
        user ? setUserLogged(true) : setUserLogged(false)
        setCurrentUser(user)
    })

    navigation.setOptions({ title: nameProduct })

    useFocusEffect(
        useCallback(() => {
            (async() => {
                const response = await getDocumentById("products", id)
                if (response.statusResponse) {
                    setProduct(response.document)
                } else {
                    setProduct({})
                    Alert.alert("Ocurrio un problema cargando la opcion escogida.")
                }
            })()
        }, [])
    )
    useEffect(() => {
        (async() => {
            if(userLogged && product) {
                const response = await getIsFavorite(product.id)
                response.statusResponse && setIsFavorite(response.isFavorite)
            }
        })()
    }, [userLogged, product])

    const addFavorite = async() => {
        if(!userLogged) {
            toastRef.current.show("Para agregar el producto a Favoritos, debes estar logueado.", 3000)
            return
        }
        setLoading(true)
        const response = await addDocumentWithoutId("favorites", {
            idUser: getCurrentUser().uid,
            idProduct: product.id
        })
        setLoading(false)
        if(response.statusResponse){
            setIsFavorite(true)
            toastRef.current.show("Producto añadido a Favoritos.", 3000)
        } else {
            toastRef.current.show("No se pudo adicionar el producto a Favoritos.", 3000)
        }
    }

    const removeFavorite = async() => {
        setLoading(true)
        const response = await deleteFavorite(product.id)
        setLoading(false)

        if(response.statusResponse) {
            setIsFavorite(false)
            toastRef.current.show("Producto eliminado de Favoritos.", 3000)
        } else {
            toastRef.current.show("No se pudo eliminar el producto de Favoritos.", 3000)
        }
    }

    if (!product){
        return <Loading isVisible={true} text="Cargando..."/>
    }
    return (
        <ScrollView style={styles.viewBody}>
            <CarouselImages
                images={product.images}
                height={250}
                width={widthScreen}
                activeSlide={activeSlide}
                setActiveSlide={setActiveSlide}
            />
            <View style={styles.viewFavorites}>
                <Icon
                    type="material-community"
                    name={ isFavorite ? "heart" : "heart-outline" }
                    onPress={ isFavorite ? removeFavorite : addFavorite }
                    color="#ff2020"
                    size={35}
                    underlayColor="transparent"
                />
            </View>
            <TitleProduct
                nameProduct={product.nameProduct}
                nameRestaurant={product.nameRestaurant}
                description={product.description}
                rating={product.rating}
            />
            <RestaurantInfo
                nameProduct={product.nameProduct}
                typeProduct={product.typeProduct}
                font={product.font}
                location={product.location}
                address={product.address}
                typeAttention={product.typeAttention}
                price={product.price}
                phone={formatPhone(product.callingCode, product.phone)}
                currentUser={currentUser}
                callingCode ={product.callingCode}
                phoneNoFormat={product.phone}
                setLoading={setLoading}
                setModalNotification={setModalNotification}
            />
            <ListReviews
                navigation={navigation}
                idProduct={product.id}
            />
            <SendMessage
                modalNotification={modalNotification}
                setModalNotification={setModalNotification}
                setLoading={setLoading}
                product={product}
            />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={loading} text="Por favor, espere..."/>
        </ScrollView>
    )
}

function SendMessage({ modalNotification, setModalNotification, setLoading, product }){
    const [title, setTitle] = useState(null)
    const [errorTitle, setErrorTitle] = useState(null)
    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)

    const sendNotification = async() => {
        if(!validForm()) {
            return
        }

        setLoading(true)
        const userName = getCurrentUser().displayName ? getCurrentUser().displayName : "Anonimo"
        const theMessage = `${message}, del producto: ${product.nameProduct}`

        const usersFavorite = await getUsersFavorite(product.id)
        if(!usersFavorite.statusResponse) {
            setLoading(false)
            Alert.alert("Error al obtener lo usuarios que prefieren el producto.")
            return
        }

        await Promise.all (
            map(usersFavorite.users, async(user) => {
                const messageNotification = setNotificationMessage(
                    user.token,
                    `${userName}, dijo ${title}`,
                    theMessage,
                    { data: theMessage } 
                )
        
                await sendPushNotification(messageNotification)
            })
        )

        setLoading(false)
        setTitle(null)
        setMessage(null)
        setModalNotification(false)
    }

    const validForm = () => {
        let isValid = true

        if(isEmpty(title)){
            setErrorTitle("Debes ingresar un titulo a tu mensaje.")
            isValid=false
        }

        if(isEmpty(message)){
            setErrorMessage("Debes ingresar un mensaje.")
            isValid=false
        }
        return isValid
    }
    
    return (
        <Modal
            isVisible={modalNotification}
            setVisible={setModalNotification}
        >
            <View style={styles.modalContainer}>
                <Text style={styles.textModal}>
                    Enviale un mensaje a los amantes de {product.nameProduct}
                </Text>
                <Input
                    placeholder="Titulo del mensaje..."
                    onChangeText={(text) => setTitle(text)}
                    value={title}
                    errorMessage={errorTitle}
                />
                <Input
                    placeholder="Mensaje..."
                    multiline
                    inputStyle={styles.textArea}
                    onChangeText={(text) => setMessage(text)}
                    value={message}
                    errorMessage={errorMessage}
                />
                <Button
                    title="Enviar Mensaje"
                    buttonStyle={styles.btnSend}
                    containerStyle={styles.btnSendContainer}
                    onPress={sendNotification}
                />
            </View>
        </Modal>
    )
}

function RestaurantInfo({ nameProduct, typeProduct, 
    font, location, address, typeAttention, price, phone, currentUser, callingCode, phoneNoFormat, 
    setModalNotification }) {
    const listInfo = [
        {type:"address", text: address, iconLeft: "map-marker", iconRight: "message-text-outline"},
        {type:"phone", text: phone, iconLeft: "phone", iconRight: "whatsapp"},
        {type:"typeProduct", text: typeProduct, iconLeft: "store"},
        {type:"font", text: font, iconLeft: "food-variant"},
        {type:"typeAttention", text: typeAttention, iconLeft: "table-chair"},
        {type:"price", text: "S/."+price+".00", iconLeft: "cash-multiple"}
    ]

    const actionLeft = (type) => {
        if(type == "phone") {
            callNumber(phone)
        } 
    }

    const actionRight = (type) => {
        if(type == "phone") {
            if (currentUser) {
                sendWhatsApp(`${callingCode}${phoneNoFormat}`, `Hola! Soy ${currentUser.displayName}, estoy interesado en sus servicios y/o productos.`)
            } else {
                sendWhatsApp(phone, `Hola! Estoy interesado en sus servicios.`)
            } 
        } else if (type == "address"){
            setModalNotification(true)
        } 
    }

    return (
        <View style={styles.viewRestaurantInfo}>
            <Text style={styles.RestaurantInfoTitle}>
                Informacion sobre el restaurante
            </Text>
            <MapRestaurant
                location={location}
                name={nameProduct}
                height={150}
            />
            {
                map(listInfo, (item, index) => (
                    <ListItem
                        key={index}
                        style={styles.containerListItem}
                    >
                        <Icon
                            type="material-community"
                            name={item.iconLeft}
                            color="#ff2020"
                            onPress={() => actionLeft(item.type)}
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                        {
                            item.iconRight && (
                                <Icon
                                    type="material-community"
                                    name={item.iconRight}
                                    color="#ff2020"
                                    onPress={() => actionRight(item.type)}
                                />
                            )
                        }
                    </ListItem>
                ))
            }
        </View>
    )
}

function TitleProduct({ nameProduct, nameRestaurant, description, rating }){
    return(
        <View style={styles.viewProductTtitle}>
            <View style={styles.viewProductContainer}>
                <Text style={styles.nameProduct}>{nameProduct}</Text>
                <Rating
                    style={styles.rating}
                    imageSize={20}
                    readonly
                    startingValue={parseFloat(rating)}
                /> 
            </View>
            <Text style={styles.descriptionRest}>{nameRestaurant}</Text>
            <Text style={styles.descriptionProduct}>{description}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewProductTtitle: {
        padding: 15
    },
    viewProductContainer: {
        flexDirection: "row"
    },
    descriptionRest: {
        marginTop: 4,
        color: "black",
        textAlign: "justify"
    },
    descriptionProduct: {
        marginTop: 4,
        color: "gray",
        textAlign: "justify"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    nameProduct: {
        fontWeight: "bold",
        marginRight: 95,
        fontSize: 15
    },
    viewRestaurantInfo: {
        margin: 15,
        marginTop: 12
    },
    RestaurantInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#ff2020",
        borderBottomWidth: 1
    },
    viewFavorites: {
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: "#fff",
        borderBottomLeftRadius: 25,
        padding: 5,
        paddingLeft: 10
    },
    textArea: {
        height: 50,
        paddingHorizontal: 10
    },
    btnSend: {
        backgroundColor: "#442848"
    },
    btnSendContainer: {
        width: "95%"
    },
    textModal: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
        paddingBottom: 7
    },
    modalContainer: {
        justifyContent: "center",
        alignItems: "center"
    }
})
