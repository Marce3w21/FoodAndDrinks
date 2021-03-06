import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements' 

import ProductsStack from './ProductsStack'
import FavoritesStacks from './FavoritesStacks'
import TopProductsStack from './TopProductsStack'
import SearchStack from './SearchStack'
import AccountStack from './AccountStack'

const Tab = createBottomTabNavigator()

export default function Navigation() {
    const screenOptions = (route, color) => {
        let iconName
        switch (route.name) {
            case "products":
                iconName = "food-fork-drink"
                break;
            case "favorites":
                iconName = "heart-plus-outline"
                break;
            case "top-products":
                iconName = "star-half-full"
                break;
            case "search":
                iconName = "magnify"
                break;
            case "account":
                iconName = "home-outline"
                break;
    }

        return(
            <Icon
                type="material-community"
                name={iconName}
                size={22}
                color={color}
            />
        )
    }
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName="products"
                tabBarOptions={{
                    inactiveTintColor:"#e0ad40",
                    activeTintColor:"#362a0f"
                }}
                screenOptions={({ route }) =>({
                    tabBarIcon: ({ color }) => screenOptions(route, color)
                })} 
            >
                <Tab.Screen
                    name="products"
                    component={ProductsStack}
                    options={{ title: "Productos" }}
                />
                <Tab.Screen
                    name="favorites"
                    component={FavoritesStacks}
                    options={{ title: "Favoritos" }}
                />
                <Tab.Screen
                    name="top-products"
                    component={TopProductsStack}
                    options={{ title: "Top 7" }}
                />
                <Tab.Screen
                    name="search"
                    component={SearchStack}
                    options={{ title: "Buscar" }}
                />
                <Tab.Screen
                    name="account"
                    component={AccountStack}
                    options={{ title: "Cuenta" }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}
