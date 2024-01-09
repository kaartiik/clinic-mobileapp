import { View, Text, Pressable, Image, StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import COLORS from '../constants/colors';
import Button from '../components/Button';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import firebase from '../firebase';


const QRScanner = ({ route, navigation }) => {
    const {appointment_id, patient_id} = route.params;
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
          console.log(data, appointment_id);
          const clinicAppointmentRef = doc(firebase.db, 'clinics', data, 'appointments', appointment_id);
          const patientAppointmentRef = doc(firebase.db, 'users', patient_id, 'appointments', appointment_id);
    
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

    return (
        <View
            style={{
                flex: 1
            }}
        >
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </View>
    )
}

export default QRScanner