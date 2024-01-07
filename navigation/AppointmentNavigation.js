import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Appointments from "../screens/Appointments";
import AppointmentDetails from "../screens/AppointmentDetails";

const Stack = createStackNavigator();

export default function AppointmentsNavigation() {
   return (
      <Stack.Navigator
            initialRouteName='AppointmentsHistory'
            >
            <Stack.Screen
               name="AppointmentsHistory"
               component={Appointments}
               options={{
                  headerShown: false
               }}
            />
            <Stack.Screen
               name="AppointmentDetails"
               
               component={AppointmentDetails}
               options={{
                  headerShown: true,
                  headerTitle: "Appointment Details"
               }}
            />
            </Stack.Navigator>
   );
}