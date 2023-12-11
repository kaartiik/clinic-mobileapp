import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/Button';
import { signOut } from "firebase/auth";
import firebase from '../firebase';

const signOutUser = async () => {
    try {
        await signOut(firebase.auth);
    } catch (error) {
        alert(error);
    }
}

const Profile = ({ navigation }) => {

    return (
        <LinearGradient
            style={{
                flex: 1
            }}
            colors={[COLORS.secondary, COLORS.white]}
        >
            <View style={{ flex: 1 }}>



                <Button
                    title="Sign Out"
                    filled
                    color="red"
                    style={{
                        marginTop: 18,
                        marginBottom: 4,
                    }}
                    onPress={()=> signOutUser()}
                />
            </View>
        </LinearGradient>
    )
}

export default Profile