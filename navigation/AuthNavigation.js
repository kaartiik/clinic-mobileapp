import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Login, Signup, Welcome } from "../screens";

const Stack = createStackNavigator();

export default function AuthNavigation() {
   return (
      <Stack.Navigator
            initialRouteName='Welcome'
            >
            <Stack.Screen
               name="Welcome"
               component={Welcome}
               options={{
                  headerShown: false
               }}
            />
            <Stack.Screen
               name="Login"
               component={Login}
               options={{
                  headerShown: false
               }}
            />
            <Stack.Screen
               name="Signup"
               component={Signup}
               options={{
                  headerShown: false
               }}
            />
            </Stack.Navigator>
   );
}