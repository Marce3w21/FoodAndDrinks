import React, { useState, useEffect } from 'react'
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar, Button, Icon, Input, Image } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { Picker } from '@react-native-picker/picker'
import { map, size, filter, isEmpty } from 'lodash'
import MapView from 'react-native-maps'
import uuid from 'random-uuid-v4'
import Modal from '../../components/Modal'

import { getCurrentLocation, loadImageFromGallery } from '../../utils/helpers'
import { addDocumentWithoutId, getCurrentUser, uploadImage } from '../../utils/actions'

const widthScreen = Dimensions.get("window").width

export default function AddProductForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorNameProduct, setErrorNameProduct] = useState(null)
    const [errorNameRestaurant, setErrorNameRestaurant] = useState(null)
    const [errorClass, setErrorClass] = useState(null)
    const [errorType, setErrorType] = useState(null)
    const [errorFont, setErrorFont] = useState(null)
    const [errorAddress, setErrorAddress] = useState(null)
    const [errorPhone, setErrorPhone] = useState(null)
    const [errorDescription, setErrorDescription] = useState(null)
    const [errorPrice, setErrorPrice] = useState(null)
    const [errorTypeAttention, setErrorTypeAttention] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])
    const [isVisibleMap, setIsVisibleMap] = useState(false)
    const [locationRestaurant, setLocationRestaurant] = useState(null)

    const addProduct = async() => {
        if(!validForm()){
            return
        }
        setLoading(true)
        const responseUploadImages = await uploadImages()
        const product = {
            nameProduct: formData.nameProduct,
            nameRestaurant: formData.nameRestaurant,
            class: formData.class,
            typeProduct: formData.typeProduct,
            font: formData.font,
            address: formData.address,
            location: locationRestaurant,
            country: formData.country,
            callingCode: formData.callingCode,
            phone: formData.phone,
            typeAttention: formData.typeAttention,
            description: formData.description,
            price: formData.price,
            images: responseUploadImages,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: getCurrentUser().uid
        }
        const responseAddDocument = await addDocumentWithoutId("products", product)
        setLoading(false)

        if(!responseAddDocument.statusResponse){
            toastRef.current.show("Error al grabar el producto/restaurante, por favor intenta mas tarde.", 3000)
            return
        }

        navigation.navigate("products")
    }

    const uploadImages = async() => {
        const imagesUrl = []
        await Promise.all(
            map(imagesSelected, async(image) => {
                const response = await uploadImage(image, "products", uuid())
                if(response.statusResponse){
                    imagesUrl.push(response.url)
                }
            })
        )
        return imagesUrl
    }

    const validForm = () => {
        clearErrors()
        let isValid = true

        if(isEmpty(formData.nameProduct)){
            setErrorNameProduct("Debes ingresar el nombre del producto.")
            isValid = false
        }

        if(isEmpty(formData.nameRestaurant)){
            setErrorNameRestaurant("Debes ingresar el nombre del restaurante.")
            isValid = false
        }

        if(isEmpty(formData.address)){
            setErrorAddress("Debes ingresar la direccion del restaurante.")
            isValid = false
        }

        if(size(formData.phone) < 9){
            setErrorPhone("Debes ingresar el telefono del restaurante.")
            isValid = false
        }

        if(isEmpty(formData.description)){
            setErrorDescription("Debes ingresar la descripcion del restaurante/producto.")
            isValid = false
        }

        if(isEmpty(formData.price)){
            setErrorPrice("Debes ingresar el precio del producto.")
            isValid = false
        }

        if(!locationRestaurant){
            toastRef.current.show("Debes de localizar el restaurante en el mapa.", 3000)
        } else if(size(imagesSelected) === 0) {
            toastRef.current.show("Debes de agregar al menos una imagen para el restaurante/producto.", 3000)
            isValid = false
        }

        return isValid
    }

    const clearErrors = () => {
        setErrorDescription(null)
        setErrorNameProduct(null)
        setErrorNameRestaurant(null)
        setErrorPhone(null)
        setErrorAddress(null)
        setErrorPrice(null)
    }

    return (
        <ScrollView style={styles.viewContainer}>
            <ImageProduct
                imageProduct={imagesSelected[0]}
            />
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorNameProduct={errorNameProduct}
                errorNameRestaurant={errorNameRestaurant}
                errorAddress={errorAddress}
                errorPhone={errorPhone}
                errorDescription={errorDescription}
                errorPrice={errorPrice}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear Producto"
                onPress={addProduct}
                buttonStyle={styles.btnAddProduct}
            />
            <MapRestaurant
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                locationRestaurant={locationRestaurant}
                setLocationRestaurant={setLocationRestaurant}
                toastRef={toastRef}
            />
        </ScrollView>
    )
}

function MapRestaurant({ isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef }) {
    const [newRegion, setNewRegion] = useState(null)

    useEffect(() => {
        (async() => {
            const response = await getCurrentLocation()
            if(response.status) {
                setNewRegion(response.location)
            }
        })()
    }, [])

    const confirmLocation = () => {
        setLocationRestaurant(newRegion)
        toastRef.current.show("Localizacion guardada correctamente.", 3000)
        setIsVisibleMap(false)
    }
    
    return (
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {
                    newRegion && (
                        <MapView
                            style={styles.mapStyle}
                            initialRegion={newRegion}
                            showsUserLocation={true}
                            onRegionChange={(region) => setNewRegion(region)}
                        >
                            <MapView.Marker
                                coordinate={{
                                    latitude: newRegion.latitude,
                                    longitude: newRegion.longitude
                                }}
                                draggable
                            />
                        </MapView>
                    )
                }
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={confirmLocation}
                    />
                    <Button
                        title="Cancelar Ubicacion"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function ImageProduct({ imageProduct }) {
    return (
        <View style={styles.viewPhoto}>
            <Image
                style={{ width: widthScreen, height: 200}}
                source={
                    imageProduct
                        ? { uri: imageProduct}
                        : require("../../assets/no-image.png")
                }
            />
        </View>
    )
}

function UploadImage({ toastRef, imagesSelected, setImagesSelected }) {
    const imageSelect = async() => {
        const response = await loadImageFromGallery([4,3])
        if (!response.status){
            toastRef.current.show("No has seleccionado ninguna imagen", 3000)
            return
        }
        setImagesSelected([...imagesSelected, response.image])
    }
    const removeImage = (image) => {
        Alert.alert(
            "Eliminar Imagen",
            "¿Estas seguro que deseas eliminar la imagen?",
            [
                {
                    text: "No",
                    style: "cancel"
                },
                {
                    text: "Si",
                    onPress: () => {
                        setImagesSelected(
                            filter(imagesSelected, (imageUrl) => imageUrl !== image)
                        )
                    }
                }
            ],
            {
                cancelable: true
                //canelable
            }
        )
    }

    return (
        <ScrollView
            horizontal
            style={styles.viewImage}
        >
            {
                size(imagesSelected) < 10 && ( 
                    <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                    />
                )
            }
            {
                map(imagesSelected, (imageProduct, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{uri: imageProduct}}
                        onPress={() => removeImage(imageProduct)}

                    />
                ))
            }

        </ScrollView>
    )
}

function FormAdd({ formData, setFormData, errorNameProduct, errorNameRestaurant, errorAddress, errorPhone, errorDescription, errorPrice, setIsVisibleMap, locationRestaurant }){
    const [country, setCountry] = useState("PE")
    const [callingCode, setCallingCode] = useState("51")
    const [phone, setPhone] = useState("")
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedType, setSelectedType] = useState("")
    const [selectedFont, setSelectedFont] = useState("")
    const [selectedAttentionType, setSelectedAttentionType] = useState("")

    const onChange= (e, type) => {
        setFormData({ ...formData, [type] : e.nativeEvent.text })
    }

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del producto."
                defaultValue={formData.nameProduct}
                onChange={(e) => onChange(e, "nameProduct")}
                errorMessage={errorNameProduct}

            />
            <Input
                placeholder="Nombre del restaurante."
                defaultValue={formData.nameRestaurant}
                onChange={(e) => onChange(e, "nameRestaurant")}
                errorMessage={errorNameRestaurant}
                
            />
            <Picker
                selectedValue={selectedClass}
                style={styles.pickerClass}
                onValueChange={(itemValue) =>{
                   setSelectedClass(itemValue)
                   setFormData({
                        ...formData, 
                        "class": itemValue
                })   
                }}
            >
                <Picker.Item label="Seleccione una opcion." value="option"/>
                <Picker.Item label="Comida" value="Comida"/>
                <Picker.Item label="Bebida" value="Bebida"/>
                
            </Picker>
            {/* <Input
                placeholder="Clasificacion."
                
            /> */}
            <Picker
                selectedValue={selectedType}
                style={styles.pickerClass}
                onValueChange={(itemValue) =>{
                    setSelectedType(itemValue)
                    setFormData({
                        ...formData, 
                        "typeProduct": itemValue 
                    })    
            }}
            >
                <Picker.Item label="Seleccione una opcion." value="option"/>
                <Picker.Item label="Casero" value="Casero"/>
                <Picker.Item label="Restaurante" value="Restaurante"/>
                <Picker.Item label="Quinta" value="Quinta"/>
                <Picker.Item label="Tipica" value="Tipica"/>
                <Picker.Item label="Extravagante" value="Extravagante"/>
                <Picker.Item label="Vegana" value="Vegana"/>
                
            </Picker>
            {/* <Input
                placeholder="Tipo."
                
            /> */}
            <Picker
                selectedValue={selectedFont}
                style={styles.pickerClass}
                onValueChange={(itemValue) =>{
                    setSelectedFont(itemValue)
                    setFormData({
                        ...formData,
                        "font": itemValue
                    }) 
                }
            }
            >
                <Picker.Item label="Seleccione una opcion." value="option"/>
                <Picker.Item label="Mariscos" value="Mariscos"/>
                <Picker.Item label="Pescado" value="Pescado"/>
                <Picker.Item label="Carnes" value="Carnes"/>
                <Picker.Item label="Pollo" value="Pollo"/>
                <Picker.Item label="Cerdo" value="Cerdo"/>
                <Picker.Item label="Vegetales" value="Vegetales"/>
                <Picker.Item label="Pavo" value="Pavo"/>
                <Picker.Item label="Buffet" value="Buffet"/>
                <Picker.Item label="Pizza" value="Pizza"/>
                <Picker.Item label="Sopas" value="Sopas"/>
                <Picker.Item label="Bebidas calientes" value="Bebidas calientes"/>
                <Picker.Item label="Bebidas frias" value="Bebidas frias"/>
                <Picker.Item label="Bebidas alcoholicas" value="Bebidas alcoholicas"/>
                <Picker.Item label="Empanadas" value="Empanadas"/>
                <Picker.Item label="Postres" value="Postres"/>
            </Picker>
            {/* <Input
                placeholder="Fuente."
                
            /> */}
            <Input
                placeholder="Direccion del restaurante."
                defaultValue={formData.address}
                onChange={(e) => onChange(e, "address")}
                errorMessage={errorAddress}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#721c1c" : "#c2c2c2",
                    onPress: () => setIsVisibleMap(true)           }
                }
                
            />
            <View style={styles.phoneView}>
                <CountryPicker
                    withFlag
                    withCallingCode
                    withFilter
                    withCallingCodeButton
                    containerStyle = {styles.countryPicker}
                    countryCode={country}
                    onSelect={(country) => {
                        setFormData({
                            ...formData, 
                            "country": country.cca2, 
                            "callingCode": country.callingCode[0] 
                        })
                        setCountry(country.cca2)
                        setCallingCode(country.callingCode[0])
                    }}
                />
                <Input
                    placeholder="Numero del restaurante."
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    defaultValue={formData.phone}
                    onChange={(e) => onChange(e, "phone")}
                    errorMessage={errorPhone}
                />
            </View>
            <Picker
                selectedValue={selectedAttentionType}
                style={styles.pickerClass}
                onValueChange={(itemValue) =>{
                    setSelectedAttentionType(itemValue)
                    setFormData({
                        ...formData,
                        "typeAttention": itemValue
                    })
                }
            }
            >
                <Picker.Item label="Seleccione una opcion." value="option"/>
                <Picker.Item label="Delivery" value="Delivery"/>
                <Picker.Item label="Consumo en local" value="Consumo en local"/>
                <Picker.Item label="Recojo en local" value="Recojo en local"/>
            </Picker>
            {/* <Input
                placeholder="Tipo de atencion."
                
            /> */}
            <Input
                placeholder="Descripcion del producto."
                multiline
                containerStyle={styles.textArea}
                defaultValue={formData.description}
                onChange={(e) => onChange(e, "description")}
                errorMessage={errorDescription}
                
            />
            <Input
                placeholder="Precio del producto."
                keyboardType="phone-pad"
                defaultValue={formData.price}
                onChange={(e) => onChange(e, "price")}
                errorMessage={errorPrice}
            />
        </View>
    )
}

const defaultFormValues = () => {
    return{
        nameProduct: "",
        nameRestaurant: "",
        class: "",
        typeProduct: "",
        font: "",
        address: "",
        country: "PE",
        callingCode: "51",
        phone: "",
        typeAttention: "",
        description: "",
        price: ""
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        height: "100%",
        marginTop: 6
    },
    viewForm: {
        marginHorizontal: 10
    },
    textArea: {
        height: 100,
        width: "100%"
    },
    phoneView: {
        width: "80%",
        flexDirection: "row",
        marginLeft: 12
    },
    inputPhone: {
        width: "80%"
    },
    btnAddProduct: {
        margin: 20,
        backgroundColor: "#721c1c"
    },
    pickerClass: {
        width: "100%",
        height: 35,
        marginBottom: 10,
        marginLeft: 2
    },
    viewImage: {
        flexDirection: "row",
        marginHorizontal: 20,
        marginTop: 30
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#442484"
    }, 
    viewMapBtnCancel: {
        backgroundColor: "#721c1c"
    }
})
