import 'react-native-gesture-handler';
import React, { useEffect, useState } from "react";
import AuthContext from "./context/AuthContext";
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './navigation/AuthNavigation'
import HomeNavigation from './navigation/HomeNavigation'
import firebase from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import Services from "./shared/Services";


export default function App() {
  const {auth} = firebase;
  const [userData, setUserData] = useState();

  const onAuthStateSave = async (user) => {
    if (user) {
      // User is signed in
      setUserData(user);
      await Services.setUserAuth(response.user);
    } else {
      // User is signed out
      setUserData(null);
      await Services.Logout();
    }
  }

  useEffect (() => {
    const subscriber = onAuthStateChanged (auth, onAuthStateSave);
    return subscriber;
  })

  
  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      <NavigationContainer>
        {userData ? (
          <HomeNavigation />
        ) : (
          <AuthNavigation />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
}