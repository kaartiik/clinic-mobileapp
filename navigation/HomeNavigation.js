import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Home} from "../screens";

const Stack = createStackNavigator();

export default function HomeNavigation() {
   return (
      <Stack.Navigator
            initialRouteName='Home'
            >
            <Stack.Screen
               name="Home"
               component={Home}
               options={{
                  headerShown: false
               }}
            />
            {/* <Stack.Screen
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
            /> */}
            </Stack.Navigator>
   );
}