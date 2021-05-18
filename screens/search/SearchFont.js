import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import { SearchBar, ListItem, Icon, Image } from 'react-native-elements'
import { isEmpty, size } from 'lodash'

import { searchFont } from '../../utils/actions'

export default function SearchFont({ navigation }) {
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState([])

    useEffect(() => {
        if (isEmpty(search)) {
            return
        }

        async function getData() {
            const response = await searchFont(search)
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
                            Para poder guiarte en tu busqueda, podras ver los tipos de comida
                            y bebida, que tenemos para ti. Cuando te decidas, ingresalo en la barra
                            de busqueda.{"\n"}
                            <Icon
                                type="font-awesome-5"
                                name="bahai"
                                size={20}
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Mariscos{"\n"}
                            </Text>

                            <Icon
                                type="font-awesome-5"
                                name="fish"
                                size={20}
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Pescado{"\n"}
                            </Text>

                            <Icon
                                type="font-awesome-5"
                                name="hamburger"
                                size={20}
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Carnes{"\n"}
                            </Text>

                            <Icon
                                type="font-awesome-5"
                                name="drumstick-bite"
                                size={20}
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Pollo{"\n"}
                            </Text>

                            <Icon
                                 type="font-awesome-5"
                                 name="hotdog"
                                 size={20}
                                 color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Cerdo{"\n"}
                            </Text>

                            <Icon
                                 type="font-awesome-5"
                                 name="carrot"
                                 size={20}
                                 color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Vegetales{"\n"}
                            </Text>

                            <Icon
                                 type="font-awesome-5"
                                 name="mitten"
                                 size={20}
                                 color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Pavo{"\n"}
                            </Text>

                            <Icon
                                type="material-community"
                                name="food"
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Buffet{"\n"}
                            </Text>

                            <Icon
                                type="font-awesome-5"
                                name="pizza-slice"
                                size={20}
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Pizza{"\n"}
                            </Text>

                            <Icon
                                type="material-community"
                                name="noodles"
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Sopas{"\n"}
                            </Text>

                            <Icon
                                type="font-awesome-5"
                                name="coffee"
                                size={20}
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Bebidas calientes{"\n"}
                            </Text>

                            <Icon
                                type="font-awesome-5"
                                name="blender"
                                size={20}
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Bebidas frias{"\n"}
                            </Text>

                            <Icon
                               type="font-awesome-5"
                               name="beer"
                               color= "#ff2020"
                               size={20}
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Bebidas alcoholicas{"\n"}
                            </Text>

                            <Icon
                                type="material-community"
                                name="food-croissant"
                                color= "#ff2020"
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Empanadas{"\n"}
                            </Text>

                            <Icon
                                type="font-awesome-5"
                                name="cookie"
                                color= "#ff2020"
                                size={20}
                                style={{ paddingRight: 10, paddingTop: 15}}
                            />
                            <Text style={styles.notFound}>
                                Postres{"\n"}
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
    const { id, nameProduct, images, font } = product.item

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
                    {font}
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
