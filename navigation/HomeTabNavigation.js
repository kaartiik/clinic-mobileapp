import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Profile} from "../screens";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import AppointmentsNavigation from "./AppointmentNavigation";

const Tab = createBottomTabNavigator();

export default function HomeTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
         tabBarActiveTintColor: '#e91e63',
      }}
    >
      <Tab.Screen 
         name="Appointments" 
         component={AppointmentsNavigation} 
         options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
               <MaterialIcons name="history" size={24} color="black" />
             ),
         }}/>
      <Tab.Screen 
         name="Home" 
         component={Home} 
         options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
               <AntDesign name="pluscircle" size={24} color="black" />
             ),
         }}/>
      <Tab.Screen 
         name="Profile" 
         component={Profile} 
         options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
               <AntDesign name="user" size={24} color="black" />
             ),
         }}/>
    </Tab.Navigator>
  );
}