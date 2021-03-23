import React, {useState, useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, Text, ScrollView } from 'react-native'
import CarouselImages from '../../components/CarouselImages'
import { ListItem, Rating, Icon } from 'react-native-elements'

import Loading from '../../components/Loading'
import { getDocumentById } from '../../utils/actions'
import { View } from 'react-native'
import { formatPhone } from '../../utils/helpers'
import MapProduct from '../../components/products/MapProduct'
import { map } from 'lodash'

const widthScreen = Dimensions.get("window").width

export default function Product({navigation, route}) {
    const { id, nameProduct} = route.params
    const [product, setProduct] = useState(null)
    const [activeSlide, setActiveSlide] = useState(0)

    navigation.setOptions({ title:nameProduct })

    useEffect(() => {
        (async() => {
            const response = await getDocumentById("products", id)
            if (response.statusResponse) {
                setProduct(response.document)
            } else {
                setProduct({})
                Alert.alert("Ocurrio un problema cargando el producto")
            }
        })()
    }, [])

    if (!product) {
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
            <TitleProduct
                nameProduct={product.nameProduct}
                description={product.description}
                rating={product.rating}
            
            />
            <ProductInfo
                nameProduct={product.nameProduct}
                nameRestaurant={product.nameRestaurant}
                classs={product.class}
                typeProduct={product.typeProduct}
                font={product.font}
                location={product.location}
                address={product.address}
                phone={formatPhone(product.callingCode, product.phone)}
                typeAttention={product.typeAttention}
                description={product.description}
                price={product.price}


            />
        </ScrollView>
    )
}

function ProductInfo({ nameProduct, nameRestaurant, classs, typeProduct, font, location, address, phone,
typeAttention, description, price }) {
    const listInfo = [
        { text: address, iconName: "map-marker"},
        { text: phone, iconName: "phone"},
    ]
    return (
        <View style={styles.viewProductInfo}>
            <Text style={styles.productInfoTitle}>
                Informacion sobre el restaurante
             </Text>
            <MapProduct
                location={location}
                nameProduct={nameProduct}
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
                            name={item.iconName}
                            color="#721c1c"
                        />
                        <ListItem.Content>
                            <ListItem.Title>{item.text}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))
            }
        </View>
    )                            

}

function TitleProduct({nameProduct, description, rating}) {
    return (
        <View style={styles.viewProductTitle}>
            <View style={styles.viewProductContainer}>
                <Text style={styles.nameProduct2}>{nameProduct}</Text>
                <Rating
                   style={styles.rating}
                   imageSize={20}
                  readonly
                  startingValue={parseFloat(rating)}
            />
            </View>
            <Text style={styles.descriptionProduct}>{description}</Text>
        </View>
    )
}



const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#fff"
    },
    viewProductTitle: {
        padding: 15,  
    },
    viewProductContainer: {
        flexDirection: "row"
    },
    descriptionProduct: {
        marginTop: 8,
        color: "gray",
        textAlign: "justify"
    },
    rating: {
        position: "absolute",
        right: 0
    },
    nameProduct2: {
        fontWeight: "bold",
        marginRight: 85
    },
    viewProductInfo: {
        margin: 15,
        marginTop: 25
    },
    productInfoTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },
    containerListItem: {
        borderBottomColor: "#721c1c",
        borderBottomWidth: 1
    }

})
