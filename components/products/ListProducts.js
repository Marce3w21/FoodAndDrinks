import { size } from 'lodash'
import React from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Image } from 'react-native-elements'

export default function ListProducts({ products, navigation, handleLoadMore }) {
    return (
        <View>
            <FlatList
                data={products}
                keyExtractor={(item, index) => index.toString() }
                onEndReachedThreshold={0.5}
                onEndReached={handleLoadMore}
                renderItem={(product) => (
                    <Product product={product} navigation={navigation}/>
                )}
            />
        </View>
    )
}

function Product({ product, navigation, handleLoadMore }){
    const { id, images, nameProduct, nameRestaurant, address, price } = product.item
    const imageRestaurant = images[0]

    const goProduct = () => {
        navigation.navigate("product", { id, nameProduct })
    }

    return (
        <TouchableOpacity onPress={goProduct}>
            <View style ={styles.viewProduct}>
                <View style={styles.viewProductImage}>
                <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff"/>}
                        source={{ uri: imageRestaurant }}
                        style={styles.imageRestaurant}
                />
                </View>
                <View style={styles.viewText}>
                    <Text style={styles.productName}>{nameProduct}</Text>
                    <Text style={styles.restaurantInformation}>{nameRestaurant}</Text>
                    <Text style={styles.restaurantInformation}>{address}</Text>
                    <Text style={styles.price}>S/.{price}.00</Text>
                    {/* <Text style={styles.productDescription}>
                        {
                            size(description) > 0
                                ? `${description.substr(0, 60)}...`
                                : description
                        }
                    </Text> */}
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    viewProduct: {
        flexDirection: "row",
        margin: 10
    },
    viewProductImage: {
        marginRight: 15,
        alignSelf: "center"
    },
    viewText: {
        flex: 1,
        borderBottomColor: "#721c1c",
        borderBottomWidth: 1
    },
    imageRestaurant: {
        width: 90,
        height: 90
    },
    productName: {
        fontWeight: "bold"
    },
    restaurantInformation: {
        paddingTop: 2,
        color: "grey"
    },
    productDescription: {
        paddingTop: 2,
        color: "grey",
        width: "75%"
    },
    price: {
        paddingTop: 2,
        color: "grey",
        paddingBottom: 5
    }
})
