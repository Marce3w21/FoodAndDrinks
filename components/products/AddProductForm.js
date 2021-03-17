import React, { useState } from 'react'
import { StyleSheet, Text, View, ScrollView, Alert} from 'react-native'
import { Avatar, Button, Icon, Input } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import {Picker} from '@react-native-picker/picker'
import {map, size, filter} from 'lodash'

import { loadImageFromGallery } from '../../utils/helpers'

export default function AddProductForm({ toastRef, setLoading, navigation }) {
    const [formData, setFormData] = useState(defaultFormValues())
    const [errorNombreProducto, setErrorNombreProducto] = useState(null)
    const [errorNombreRestaurante, setErrorNombreRestaurante] = useState(null)
    const [errorClasificacion, setErrorClasificacion] = useState(null)
    const [errorTipo, setErrorTipo] = useState(null)
    const [errorFuente, setErrorFuente] = useState(null)
    const [errorDireccion, setErrorDireccion] = useState(null)
    const [errorTelefono, setErrorTelefono] = useState(null)
    const [errorTipoAtencion, setErrorTipoAtencion] = useState(null)
    const [errorDescripcion, setErrorDescripcion] = useState(null)
    const [errorPrecio, setErrorPrecio] = useState(null)
    const [imagesSelected, setImagesSelected] = useState([])

    const addProduct = () => {
        console.log(formData)
        console.log("ga")
    }

    return (
        <View style={styles.viewContainer}>
            <FormAdd
                formData={formData}
                setFormData={setFormData}
                errorNombreProducto={errorNombreProducto}
                errorNombreRestaurante={errorNombreRestaurante}
                errorClasificacion={errorClasificacion}
                errorTipo={errorTipo}
                errorFuente={errorFuente}
                errorDireccion={errorDireccion}
                errorTelefono={errorTelefono}
                errorTipoAtencion={errorTipoAtencion}
                errorDescripcion={errorDescripcion}
                errorPrecio={errorPrecio}
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
            "¿Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text:   "No",
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
                map(imagesSelected, (imageRestaurant, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatureStyle}
                        source={{uri: imageRestaurant}}
                        onPress={() => removeImage(imageRestaurant)}
                    />
                ))
            }
            
        </ScrollView>
    )
}

function FormAdd({formData, setFormData, errorNombreProducto, errorNombreRestaurante, errorClasificacion,
    errorTipo, errorFuente, errorDireccion, errorTelefono, errorTipoAtencion, errorDescripcion, errorPrecio  }){
    const [country, setCountry] = useState("PE")
    const [callingCode, setCallingCode] = useState("51")
    const [phone, setPhone] = useState("")
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedType, setSelectedType] = useState("")
    const [selectedFont, setSelectedFont] = useState("")
    const [selectedAttentionType, setSelectedAttentionType] = useState("")

    const onChange =(e, type ) => {
        setFormData({...formData, [type] : e.nativeEvent.text })
    }

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del producto."
                defaultValue= {formData.nombreProducto}
                onChange = {(e) => onChange(e, "nombreProducto")}
                errorMessage ={errorNombreProducto}

            />
            <Input
                placeholder="Nombre del restaurante."
                defaultValue= {formData.nombreRestaurante}
                onChange = {(e) => onChange(e, "nombreRestaurante")}
                errorMessage ={errorNombreRestaurante}
                
            />
            <Picker
                selectedValue={selectedClass}
                style={styles.pickerClass}
                onValueChange={(itemValue) => {
                    setSelectedClass(itemValue)
                    setFormData({
                        ...formData,
                        "clasificacion": itemValue
                    })
            }}

            >
                <Picker.Item label="Comida" value="comida"/>
                <Picker.Item label="Bebida" value="bebida"/>
                
            </Picker>
            {/* <Input
                placeholder="Clasificacion."
                
            /> */}
            <Picker
                selectedValue={selectedType}
                style={styles.pickerClass}
                onValueChange={(itemValue) => {
                    setSelectedType(itemValue)
                    setFormData({
                        ...formData,
                        "tipo": itemValue
                    })
            }}
            >
                <Picker.Item label="Casero" value="casero"/>
                <Picker.Item label="Restaurante" value="restaurante"/>
                <Picker.Item label="Quinta" value="quinta"/>
                <Picker.Item label="Tipica" value="tipica"/>
                <Picker.Item label="Extravagante" value="extravagante"/>
                <Picker.Item label="Vegana" value="vegana"/>
                
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
                       "fuente": itemValue
                   }) 
            }}
            >
                <Picker.Item label="Mariscos" value="Mariscos"/>
                <Picker.Item label="Pescado" value="Pescado"/>
                <Picker.Item label="Carnes" value="Carnes"/>
                <Picker.Item label="Pollo" value="Pollo"/>
                <Picker.Item label="Cerdo" value="Cerdo"/>
                <Picker.Item label="Vegetariana" value="Vegetariana"/>
                <Picker.Item label="Pavo" value="Pavo"/>
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
                defaultValue= {formData.direccion}
                onChange = {(e) => onChange(e, "direccion")}
                errorMessage ={errorDireccion}
                multiline
                
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
                            "callingCode": country.callingCode[0]})
                        setCountry(country.cca2)
                        setCallingCode(country.callingCode[0])
                    }}
                />
                <Input
                    placeholder="Numero del restaurante."
                    keyboardType="phone-pad"
                    containerStyle={styles.inputPhone}
                    defaultValue= {formData.telefono}
                    onChange = {(e) => onChange(e, "telefono")}
                    errorMessage ={errorTelefono}
                />
            </View>
            <Picker
                selectedValue={selectedAttentionType}
                style={styles.pickerClass}
                onValueChange={(itemValue) =>{
                    setSelectedAttentionType(itemValue)
                    setFormData({
                        ...formData,
                        "tipoAtencion" : itemValue
                    })
            }}
            >
                <Picker.Item label="Delivery" value="delivery"/>
                <Picker.Item label="Consumo en local" value="consumolocal"/>
                <Picker.Item label="Recojo en local" value="recojolocal"/>
            </Picker>
            {/* <Input
                placeholder="Tipo de atencion."
                
            /> */}
            <Input
                placeholder="Descripcion del producto."
                defaultValue= {formData.descripcion}
                onChange = {(e) => onChange(e, "descripcion")}
                errorMessage ={errorDescripcion}

                multiline
                containerStyle={styles.textArea}
                
            />
            <Input
                placeholder="Precio del producto."
                defaultValue= {formData.precio}
                onChange = {(e) => onChange(e, "precio")}
                errorMessage ={errorPrecio}
                keyboardType="phone-pad"
                
            />
        </View>
    )
}

const defaultFormValues = () => {
    return {
        nombreProducto: "",
        nombreRestaurante: "",
        clasificacion: "",
        tipo: "",
        fuente: "",
        direccion: "",
        telefono: "",
        country: "PE",
        callingCode: "51",
        tipoAtencion: "",
        descripcion :"",
        precio: ""


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
        width: 79,
        backgroundColor: "#e3e3e3"
    },
    miniatureStyle: {
        width: 60,
        height: 70,
        marginRight: 10
    }

})
