import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native'
import { SearchBar, ListItem, Icon, Image } from 'react-native-elements'
import { isEmpty, size } from 'lodash'

import { searchRestaurants } from '../utils/actions'

export default function SearchRestaurant({ navigation }) {
    const [search, setSearch] = useState("")
    const [restaurants, setRestaurants] = useState([])

    useEffect(() => {
        if (isEmpty(search)) {
            return
        }

        async function getData() {
            const response = await searchRestaurants(search)
            if (response.statusResponse) {
                setRestaurants(response.products)
            }
        }
        getData();
    }, [search])

    return (
        <ScrollView>
            <SearchBar
                placeholder="Ingrese el nombre del restaurante..."
                onChangeText={(e) => setSearch(e)}
                containerStyle={styles.searchBar}
                value={search}
            />
            {
                size(restaurants) > 0 ? (
                    <FlatList
                        data={restaurants}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(restaurant) => 
                            <Restaurant
                                restaurant={restaurant}
                                navigation={navigation}
                            />
                        }
                    />
                ) : (
                    isEmpty(search) ? (
                        <Text style={styles.notFound}>
                            Ingrese las primeras letras del nombre del restaurante.{"\n"}  
                        </Text>
                    ) : (
                        <Text style={styles.notFound}>
                            No hay restaurantes que coincidan con el criterio de busqueda.
                        </Text>
                    )
                )
            }
        </ScrollView>
    )
}

function Restaurant({ restaurant, navigation }) {
    const { id, nameRestaurant, nameProduct, images } = restaurant.item

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
                source={{ uri: images[2] }}
                style={styles.imageRestaurant}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "bold"}}>
                    {nameRestaurant}
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
        width: "90%"
    },
    menuItem: {
        margin: 10
    }
})
