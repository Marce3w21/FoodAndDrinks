import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import { SearchBar, ListItem, Icon, Image } from 'react-native-elements'
import { isEmpty, size } from 'lodash'

import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { Platform } from 'react-native'
import "prop-types";

import { searchPrice } from '../../utils/actions'




export default function SearchPrice({ navigation }) {
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState([])

    

    useEffect(() => {
        if (isEmpty(search)) {
            return
        }

        async function getData() {
            const response = await searchPrice(search)
            if (response.statusResponse) {
                setProducts(response.products)
            }
        }
        getData();
    }, [search])


    return (
        <ScrollView>


        <MultiSlider
        

      />

            <SearchBar
                placeholder="Ingrese el tipo de comida que busques..."
                onChangeText={(e) => setSearch(e)}
                containerStyle={styles.searchBar}
                value={search}
                keyboardType="numeric"
            />
            {
                size(products) > 0 ? (
                    <FlatList
                        data={products}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(product) => 
                            <Product
                                product={product}
                                navigation={navigation}
                            />
                        }
                    />
                ) : (
                    isEmpty(search) ? (
                        <Text style={styles.notFound}>
                            Saabemos que el precio es un tema muy importante, pero no dejes que
                            el hambre te gane. Ingresa un valor, y los productos con precios menores o iguales a
                            ello se te mostraran en pantalla. ¡Disfruta tu comida/bebida!{"\n"}
                            
                        </Text>

                    ) : (
                        <Text style={styles.notFound}>
                            No hay productos que coincidan con el criterio de busqueda.
                        </Text>
                    )
                )
            }
        </ScrollView>
    )
}



function Product({ product, navigation }) {
    const { id, nameProduct, images, price } = product.item

    return (
        <ListItem
            style={styles.menuItem}
            onPress={() => navigation.navigate("products", {
                screen: "product",
                params: { id, nameProduct }
            })}
        >
            <Image
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator color="#fff"/>}
                source={{ uri: images[0] }}
                style={styles.imageRestaurant}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "bold"}}>
                    S/.{price}.00
                </ListItem.Title>
                <ListItem.Title>
                    {nameProduct}
                </ListItem.Title>
            </ListItem.Content>
            <Icon
                type="material-community"
                name="chevron-right"
            />
        </ListItem>
    )
}


const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 8,
        backgroundColor: "#fff"
    },
    imageRestaurant: {
        width: 90,
        height: 90
    },
    notFound: {
        alignSelf: "center",
        width: "90%",
        textAlign: "justify"
    },
    menuItem: {
        margin: 10
    }

    
    
})


