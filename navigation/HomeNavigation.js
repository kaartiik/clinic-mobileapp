import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeTab from "./HomeTabNavigation";
import QRScanner from "../screens/QRScanner";

const Stack = createStackNavigator();

export default function HomeNavigation() {
   return (
      <Stack.Navigator
            initialRouteName='HomeTab'
            >
            <Stack.Screen
               name="HomeTab"
               component={HomeTab}
               options={{
                  headerShown: false
               }}
            />
            <Stack.Screen
               name="QRScanner"
               component={QRScanner}
               options={{
                  headerShown: false
               }}
            />
            {/*<Stack.Screen
               name="Signup"
               component={Signup}
               options={{
                  headerShown: false
               }}
            /> */}
            </Stack.Navigator>
   );
}