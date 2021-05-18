import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Search from '../screens/Search'
import SearchRestaurant from '../screens/SearchRestaurant'
import SearchGeneral from '../screens/SearchGeneral'
import SearchFont from '../screens/search/SearchFont'
import SearchTypeAttention from '../screens/search/SearchTypeAttention'
import SearchPrice from '../screens/search/SearchPrice'

const Stack = createStackNavigator()

export default function SearchStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="search-general"
                component={SearchGeneral}
                options={{ title: "¿Que se te antoja hoy?" }}
            />
            <Stack.Screen
                name="search"
                component={Search}
                options={{ title: "Encuentra tu comida/bebida ideal" }}
            />
            <Stack.Screen
                name="search-restaurant"
                component={SearchRestaurant}
                options={{ title: "Encuentra tu restaurante ideal" }}
            />
            <Stack.Screen
                name="search-font"
                component={SearchFont}
                options={{ title: "¿Buscas algun tipo de comida en especial?" }}
            />
            <Stack.Screen
                name="search-typeattention"
                component={SearchTypeAttention}
                options={{ title: "¿En casa o en local?...¡Tu decides!" }}
            />
            <Stack.Screen
                name="search-price"
                component={SearchPrice}
                options={{ title: "¡Que el hambre no te gane! Busca por precio" }}
            />
        </Stack.Navigator>
    )
}
