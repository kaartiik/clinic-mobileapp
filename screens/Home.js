import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet,Platform, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/Button';
import firebase from '../firebase';
import {collection, getDocs, doc, setDoc, addDoc, Timestamp } from "firebase/firestore";
import {Calendar} from 'react-native-calendars';
import AuthContext from '../context/AuthContext';


const Home = ({ navigation }) => {
    const { userData } = useContext(AuthContext);
    const [clinics, setClinics] = useState([]);
    const [selectedClinic, setSelectedClinic] = useState();
    const [timeslots, setTimeslots] = useState([]);
    const [selectedDate, setSelectedDate] = useState();
    const [selectedDateObject, setSelectedDateObject] = useState();
    const [selectedTime, setSelectedTime] = useState();
    const date = new Date();
    
    let clinicsArray = [];

    const fetchData = async () => {
        const querySnapshot = await getDocs(collection(firebase.db, "clinics"));
        querySnapshot.forEach((doc) => {
            clinicsArray.push({label:doc.data().clinic_name, value:doc.data().clinic_id, openingTime:doc.data().opening_time, closingTime:doc.data().closing_time});
          });

        // const clinicsArray = querySnapshot.map(doc => ({ id: doc.id, ...doc.data() }));

        setClinics(clinicsArray);
    };
    
    useEffect(() => {
        fetchData();
    }, []);

    function convertTo24Hour(time) {
        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':').map(Number);
    
        if (hours === 12) {
            hours = 0;
        }
        if (modifier === 'PM') {
            hours += 12;
        }
    
        return { hours, minutes };
    }
    
    function format12Hour(hours, minutes) {
        const modifier = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
    
        return `${hours}:${minutes} ${modifier}`;
    }

    const createTimeSlots = (start, end) => {
        let startTime = convertTo24Hour(start);
        let endTime = convertTo24Hour(end);
        let currentDate = new Date();
        let slots = [];
    
        currentDate.setHours(startTime.hours, startTime.minutes, 0);
    
        while (currentDate.getHours() < endTime.hours || (currentDate.getHours() === endTime.hours && currentDate.getMinutes() < endTime.minutes)) {
            const time = format12Hour(currentDate.getHours(), currentDate.getMinutes());
            slots.push({label: time, value: time});
            currentDate.setMinutes(currentDate.getMinutes() + 30);
        }
        
        setTimeslots(slots);
    }

    const setClinic = (clinicID) => {
        if(clinicID){
            const clinicData = clinics.find(item => item.value = clinicID);
            setSelectedClinic(clinicData);
            createTimeSlots(clinicData.openingTime, clinicData.closingTime);
        }
    }

    const getHoursAndMinutes = (timeString) => {
        // Extract hours, minutes, and AM/PM from the time string
        const parts = timeString.match(/(\d+):(\d+) (\w+)/);
        if (!parts) {
            throw new Error('Invalid time format');
        }
    
        let hours = parseInt(parts[1], 10);
        const minutes = parseInt(parts[2], 10);
        const meridian = parts[3];
    
        // Convert 12-hour format to 24-hour format
        if (hours === 12) {
            hours = 0;
        }
        if (meridian === 'PM') {
            hours += 12;
        }
    
        // Set the hours and minutes on the provided date object
        return {hours, minutes};
    }

    const bookAppointment = async () => {
        try {
            const {hours, minutes} = getHoursAndMinutes(selectedTime);
            date.setDate(selectedDateObject.day);
            date.setMonth(selectedDateObject.month - 1);
            date.setFullYear(selectedDateObject.year);
            date.setHours(hours, minutes, 0, 0);

            const appointmentData = {
                patient_id: userData.uid,
                clinic_id: selectedClinic.value,
                appointment_date: date
            }
            const clinicDocRef = await addDoc(collection(firebase.db, "clinics", selectedClinic.value, "appointments"), appointmentData);
            await setDoc(doc(firebase.db, "users", userData.uid, "appointments", clinicDocRef.id), appointmentData);

            alert('Appointment booked!')

        } catch (error) {
            alert(error);
         }
    }

    

    return (
        <LinearGradient
            style={{
                flex: 1
            }}
            colors={[COLORS.secondary, COLORS.white]}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <RNPickerSelect
                    key={(value, index) => "clinic"+value}
                    onValueChange={(value) => setClinic(value)}
                    items={clinics}
                    style={
                        Platform.OS === 'ios'
                        ? styles.inputIOS
                        : styles.inputAndroid
                    }
                />
                {selectedClinic &&
                    <Calendar
                        style={{
                            borderWidth: 1,
                            borderColor: 'gray',
                        }}
                        minDate={`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
                        disableAllTouchEventsForDisabledDays={true}
                        onDayPress={day => {
                            // createTimeSlots();
                            setSelectedDate(day.dateString);
                            setSelectedDateObject(day);
                        }}
                        markedDates={{
                            [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
                          }}
                    />
                }

                {selectedDate &&
                    <RNPickerSelect
                        key={(value, index) => "time"+index}
                        onValueChange={(value) => {
                            setSelectedTime(value);
                        }}
                        items={timeslots}
                        style={
                            Platform.OS === 'ios'
                            ? styles.inputIOS
                            : styles.inputAndroid
                        }
                    />
                }

                <Button
                    title="Book"
                    filled
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                        paddingHorizontal: 10
                    }}
                    onPress={()=> bookAppointment()}
                />

            </View>
        </LinearGradient>
    )
}

export default Home

const styles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: 'purple',
      borderRadius: 8,
      color: 'black',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
      },
      itemText: {
        color: '#888',
        fontSize: 16,
      }
  });