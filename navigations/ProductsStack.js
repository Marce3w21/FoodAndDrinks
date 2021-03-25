import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Products from '../screens/products/Products'
import AddProducts from '../screens/products/AddProducts'
import Product from '../screens/products/Product'
import AddReviewProduct from '../screens/products/AddReviewProduct'

const Stack = createStackNavigator()

export default function ProductsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="products"
                component={Products}
                options={{ title: "Vea nuestra lista de opciones" }}
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
            <Stack.Screen
                name="add-review-product"
                component={AddReviewProduct}
                options={{ title: "Nuevo Comentario" }}
            />
        </Stack.Navigator>
    )
}
