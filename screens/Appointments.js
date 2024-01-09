import { View, FlatList, Text, Pressable, Image } from 'react-native'
import React, {useEffect, useState, useContext} from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/Button';
import { collection, getDocs, Timestamp } from "firebase/firestore";
import firebase from '../firebase';
import AuthContext from '../context/AuthContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Appointments = ({ navigation }) => {
    const { userData } = useContext(AuthContext);
    const [appointments, setAppointments] = useState();


    function displayAppointmentTime(firestoreTimestamp) {
        // Convert Firestore Timestamp to JavaScript Date object
        const date = firestoreTimestamp.toDate();
    
        // Format the date and time
        const formattedTime = date.toLocaleTimeString('en-US');
    
        return `${formattedTime}`;
    }

    function displayAppointmentDate(firestoreTimestamp) {
        // Convert Firestore Timestamp to JavaScript Date object
        const date = firestoreTimestamp.toDate();
    
        // Format the date and time
        const formattedDate = date.toLocaleDateString('en-US');
    
        return `${formattedDate}`;
    }
  
      const fetchData = async () => {
        let appointmentsArray = [];

        const appointmentSnapshot = await getDocs(collection(firebase.db, "users", userData.uid, "appointments"));
  
        appointmentSnapshot.forEach((doc) => {
            appointmentsArray.push({
                ...doc.data(),
                appointment_id: doc.id,
                appointment_time: displayAppointmentTime(doc.data().appointment_date),
                appointment_date: displayAppointmentDate(doc.data().appointment_date),
            });
        });
        
        setAppointments(appointmentsArray);
    };

    useEffect(() => {
        fetchData();
    },[])

    return (
        <LinearGradient
            style={{
                flex: 1,
                padding: 20,
            }}
            colors={[COLORS.secondary, COLORS.white]}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <FlatList 
                data={appointments}
                renderItem={({item}) => (
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 10, borderBottomWidth: 0.5, borderBottomColor: 'black'}}>
                        <Text>{item.appointment_date} </Text>
                        <Text> {item.appointment_time}</Text>

                        <TouchableOpacity style={{flexDirection: 'row', borderWidth: 1, padding: 10, borderRadius: 20}} onPress={() => navigation.navigate("AppointmentDetails", {...item})}>
                            <Text>Details</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{flexDirection: 'row', borderWidth: 1, padding: 10, borderRadius: 20}} onPress={() => navigation.navigate("QRScanner", {appointment_id: item.appointment_id, patient_id: item.patient_id})}>
                            <Text>Check-In</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={(
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>
                            No appointment history
                        </Text>
                    </View>
                )}
                />
            </View>
        </LinearGradient>
    )
}

export default Appointments