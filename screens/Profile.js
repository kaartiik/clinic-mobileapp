import { View, Text, Pressable, Image } from 'react-native'
import React, {useContext} from 'react'
import { LinearGradient } from "expo-linear-gradient";
import COLORS from '../constants/colors';
import Button from '../components/Button';
import { signOut } from "firebase/auth";
import firebase from '../firebase';
import AuthContext from '../context/AuthContext';

const signOutUser = async () => {
    try {
        await signOut(firebase.auth);
    } catch (error) {
        alert(error);
    }
}

const Profile = ({ navigation }) => {
    const {userData} = useContext(AuthContext);

    return (
        <LinearGradient
            style={{
                flex: 1,
                padding: 20
            }}
            colors={[COLORS.secondary, COLORS.white]}
        >
            <View style={{ flex: 1 }}>
                <Text>
                    Name: {userData.first_name} {userData.last_name}
                </Text>

                <Text>
                    Date of Birth: {userData.dob}
                </Text>


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