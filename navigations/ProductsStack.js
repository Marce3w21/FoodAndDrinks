import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Products from '../screens/products/Products'
import AddProducts from '../screens/products/AddProducts'
import Product from '../screens/products/Product'

const Stack = createStackNavigator()

export default function ProductsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="products"
                component={Products}
                options={{ title: "Productos" }}
            />
            <Stack.Screen
                name="add-products"
                component={AddProducts}
                options={{ title: "Añadir Producto" }}
            />
            <Stack.Screen
                name="product"
                component={Product}
            />
        </Stack.Navigator>
    )
}
