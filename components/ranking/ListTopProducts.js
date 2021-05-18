import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { Card, Image, Icon, Rating } from 'react-native-elements'

export default function ListTopProducts({ products, navigation }) {
    return (
        <FlatList
            data={products}
            keyExtractor={(item, index) => index.toString()}
            renderItem={(product) => (
                <Product product={product} navigation={navigation}/>
            )}
        />
    )
}

function Product({ product, navigation }) {
    const { nameProduct, rating, images, description, id } = product.item
    const [iconColor, setIconColor] = useState("#000")

    useEffect(() => {
        if (product.index === 0){
            setIconColor("#efb819")
        } else if (product.index === 1){
            setIconColor("#8a9597")
        } else if (product.index === 2){
            setIconColor("#cd7f32")
        }
    }, [])

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("products", {
            screen: "product",
            params: { id, nameProduct }
        })}
        >
            <Card containerStyle={styles.containerCard}>
                <Icon
                    type="material-community"
                    name="chess-queen"
                    color={iconColor}
                    size={40}
                    containerStyle={styles.containerIcon}
                />
                <Image
                    style={styles.productImage}
                    resizeMode="cover"
                    PlaceholderContent={<ActivityIndicator size="large" color="#FFF"/>}
                    source={{ uri: images[0] }}
                />
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{nameProduct}</Text>
                    <Rating
                        imageSize={20}
                        startingValue={rating}
                        readonly
                    />
                </View>
                <Text style={styles.description}>{description}</Text>
            </Card>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    containerCard: {
        marginBottom: 22,
        borderWidth: 0
    },
    containerIcon: {
        position: "absolute",
        top: -30,
        left: -30,
        zIndex: 1
    },
    productImage: {
        width: "100%",
        height: 200
    },
    title: {
        paddingTop: 7,
        paddingBottom: 7,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        paddingRight: 8
    },
    description: {
        paddingTop: 7,
        color: "grey",
        marginTop: 0,
        textAlign: "justify"
    },
    // titleRating: {
    //     flexDirection: "row",
    //     marginVertical: 10,
    //     justifyContent: "space-between"
    // }
})
