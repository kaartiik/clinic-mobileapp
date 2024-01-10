import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from "react";
import { Platform } from 'react-native';
import AuthContext from "./context/AuthContext";
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigation from './navigation/AuthNavigation'
import HomeNavigation from './navigation/HomeNavigation'
import firebase from './firebase';
import { onAuthStateChanged } from "firebase/auth";
import Services from "./shared/Services";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


export default function App() {
  const {auth} = firebase;
  const [userData, setUserData] = useState();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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

  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }

      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });

      console.log(token);

    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    return token.data;
  }

  useEffect (() => {
    const subscriber = onAuthStateChanged (auth, onAuthStateSave);

    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    return () => {
      subscriber;
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    }
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