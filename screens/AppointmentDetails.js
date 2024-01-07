import { View, FlatList, Text, Pressable, Image } from 'react-native'
import React, {useEffect, useState, useContext} from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/Button';
import { collection, getDocs, Timestamp } from "firebase/firestore";
import firebase from '../firebase';
import AuthContext from '../context/AuthContext';

const AppointmentDetails = ({ route, navigation }) => {
    const {appointment_date, appointment_time ,doctor_notes, medical_info, medications} = route.params;
    console.log(route);

    return (
        <LinearGradient
            style={{
                flex: 1,
                padding: 20
            }}
            colors={[COLORS.secondary, COLORS.white]}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text>Date: {appointment_date}</Text>
                <Text>Time: {appointment_time}</Text>
                <Text>Doctor Notes: {doctor_notes}</Text>
                <Text>Medical Info: {medical_info}</Text>
                <Text>Medications: {medications.join(", ")}</Text>
            </View>
        </LinearGradient>
    )
}

export default AppointmentDetails