import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import React, {useEffect, useState, useContext} from 'react'
import COLORS from '../constants/colors';
import Button from '../components/Button';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { signOut } from "firebase/auth";
import { doc, setDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import firebase from '../firebase';
import AuthContext from '../context/AuthContext';


const QRScanner = ({ route, navigation }) => {
    const { userData } = useContext(AuthContext);
    const {hasAppointment, appointment_id} = route.params;
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        const getBarCodeScannerPermissions = async () => {
          const { status } = await BarCodeScanner.requestPermissionsAsync();
          setHasPermission(status === 'granted');
        };
    
        getBarCodeScannerPermissions();
      }, []);

      const handleBarCodeScanned = async ({ type, data }) => {
        setScanned(true);
        const firestoreData = {
          checked_in: true,
          check_in_time: new Date()
        }
    
        try {
          const clinicAppointmentRef = doc(firebase.db, 'clinics', data, 'appointments', appointment_id);
          const patientAppointmentRef = doc(firebase.db, 'users', userData.id, 'appointments', appointment_id);
    
          const updateAppointmentMedicalInfoClinic = await updateDoc(clinicAppointmentRef, firestoreData);
          const updateAppointmentMedicalInfoPatient = await updateDoc(patientAppointmentRef, firestoreData);

          alert("Successfully checked in!");
        } catch(error) {
          alert(error)
        }
        finally{
          navigation.goBack();
        }
      };
    
      if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
      }
      if (hasPermission === false) {
        return <Text>No access to camera</Text>;
      }

      const bookAppointment = async ({ type, data }) => {
        console.log("TEESSSSSSSTTT", data);
        setScanned(true);
        try {
            const appointmentData = {
                patient_id: userData.id,
                patient_name: `${userData.first_name} ${userData.last_name}`,
                clinic_id: data,
                appointment_booked: false,
                appointment_date: "N/A",
                checked_in: false,
                checked_in: true,
                check_in_time: new Date()
            }

            const clinicDocRef = await addDoc(collection(firebase.db, "clinics", data, "appointments"), appointmentData);
            await setDoc(doc(firebase.db, "users", userData.id, "appointments", clinicDocRef.id), appointmentData);

            alert('Checked in!')

        } catch (error) {
            alert(error);
         }
         finally{
          navigation.goBack();
        }
    }

    return (
        <View
            style={{
                flex: 1
            }}
        >
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : hasAppointment ? handleBarCodeScanned : bookAppointment}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    )
}

export default QRScanner