import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import TopProducts from '../screens/TopProducts'

const Stack = createStackNavigator()

export default function TopProductsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="top-products"
                component={TopProducts}
                options={{ title: "Las Mejores Opciones" }}
            />
        </Stack.Navigator>
    )
}
