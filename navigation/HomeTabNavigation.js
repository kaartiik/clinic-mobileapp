import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Profile} from "../screens";

const Tab = createBottomTabNavigator();

export default function HomeTab() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
         name="Home" 
         component={Home} 
         options={{
            headerShown: false
         }}/>
      <Tab.Screen 
         name="Profile" 
         component={Profile} 
         options={{
            headerShown: false
         }}/>
    </Tab.Navigator>
  );
}