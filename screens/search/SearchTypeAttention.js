import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import { SearchBar, ListItem, Icon, Image } from 'react-native-elements'
import { isEmpty, size } from 'lodash'

import { searchTypeAttention } from '../../utils/actions'

export default function SearchTypeAttention({ navigation }) {
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState([])

    useEffect(() => {
        if (isEmpty(search)) {
            return
        }

        async function getData() {
            const response = await searchTypeAttention(search)
            if (response.statusResponse) {
                setProducts(response.products)
            }
        }
        getData();
    }, [search])

    return (
        <ScrollView>
            <SearchBar
                placeholder="Ingrese el tipo de comida que busques..."
                onChangeText={(e) => setSearch(e)}
                containerStyle={styles.searchBar}
                value={search}
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
                            Debido a la situaciom que todos estamos viviendo, tenemos que cuidarnos, y podras buscar como deseas
                            consumir tu comida/bebida. Cuando te decidas, ingresalo en la barra
                            de busqueda.{"\n"}
                            <Icon
                                type="font-awesome-5"
                                name="car-side"
                                size={20}
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Delivery{"\n"}
                            </Text>

                            <Icon
                                type="font-awesome-5"
                                name="store-alt"
                                size={20}
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Consumo en local{"\n"}
                            </Text>

                            <Icon
                                type="font-awesome-5"
                                name="people-arrows"
                                size={20}
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Recojo en local{"\n"}
                            </Text>
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
    const { id, nameProduct, images, typeAttention } = product.item

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
                    {typeAttention}
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
