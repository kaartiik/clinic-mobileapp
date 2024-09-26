import { View, FlatList, Text, RefreshControl, ActivityIndicator} from 'react-native'
import React, {useEffect, useState, useContext} from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/Button';
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import firebase from '../firebase';
import AuthContext from '../context/AuthContext';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Appointments = ({ navigation }) => {
    const { userData } = useContext(AuthContext);
    const [appointments, setAppointments] = useState();
    const [refreshing, setRefreshing] = useState(true);



    function displayAppointmentTime(firestoreTimestamp) {
        // Convert Firestore Timestamp to JavaScript Date object
        const date = firestoreTimestamp.toDate();
    
        // Format the date and time
        const formattedTime = date.toLocaleTimeString(['en-US'], {
            hour: '2-digit',
            minute: '2-digit'
          });
    
        return `${formattedTime}`;
    }

    function displayAppointmentDate(firestoreTimestamp) {
        // Convert Firestore Timestamp to JavaScript Date object
        const date = firestoreTimestamp.toDate();
    
        // Format the date and time
        const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    
        return `${formattedDate}`;
    }
  
      const fetchData = async () => {
        let appointmentsArray = [];

        try{
        const appointmentRefQuery = query(collection(firebase.db, "users", userData.id, "appointments"), orderBy('appointment_date', 'asc'));
        const appointmentSnapshot = await getDocs(appointmentRefQuery);

        appointmentSnapshot.forEach((doc) => {
            appointmentsArray.push({
                ...doc.data(),
                appointment_id: doc.id,
                appointment_time: doc.data().appointment_booked  ? displayAppointmentTime(doc.data().appointment_date) : displayAppointmentTime(doc.data().check_in_time),
                appointment_date: doc.data().appointment_booked ? displayAppointmentDate(doc.data().appointment_date) : displayAppointmentDate(doc.data().check_in_time),
            });
        });
        setAppointments(appointmentsArray);
        } catch(error) {
            alert(error);
        } finally {
            setRefreshing(false);
        }
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
                <TouchableOpacity style={{flexDirection: 'row', borderWidth: 1, padding: 10, marginBottom:20, borderRadius: 20}} onPress={() => navigation.navigate("QRScanner", {hasAppointment: false})}>
                    <Text>Check-In Without Appointment</Text>
                </TouchableOpacity>

                <FlatList 
                data={appointments}
                renderItem={({item}) => (
                    <View style={{width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', padding: 10, borderBottomWidth: 0.5, borderBottomColor: 'black'}}>
                        <Text>{item.appointment_date} </Text>
                        <Text> {item.appointment_time}</Text>

                        <View style={{flexDirection: 'row', paddingHorizontal: 10}}>
                        {item.doctor_notes &&
                            <TouchableOpacity style={{flexDirection: 'row',borderWidth: 1, padding: 10, borderRadius: 20}} onPress={() => navigation.navigate("AppointmentDetails", {...item})}>
                                <Text>Details</Text>
                            </TouchableOpacity>
                }

                            {item.appointment_booked &&
                            <TouchableOpacity style={{flexDirection: 'row',borderWidth: 1, padding: 10, borderRadius: 20}} onPress={() => navigation.navigate("QRScanner", {hasAppointment: true, appointment_id: item.appointment_id})}>
                                <Text>Check-In</Text>
                            </TouchableOpacity>
                            }
                        </View>
                    </View>
                )}
                ListEmptyComponent={(
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text>
                            No appointment history
                        </Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => fetchData()} />
                }
                />
            </View>
        </LinearGradient>
    )
}

export default Appointments