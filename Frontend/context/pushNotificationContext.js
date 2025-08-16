import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router }from 'expo-router';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // shouldShowAlert: true,
    // shouldShowList: true,
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const PushNotificationContext = createContext();

export const usePushNotifications = () => {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error('usePushNotifications must be used within a PushNotificationProvider');
  }
  return context;
};

export const PushNotificationProvider = ({ children }) => {
  const [fcmToken, setFcmToken] = useState('');
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    registerForPushNotificationsAsync();
    
    // Listen for notifications received while app is running
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listen for notification responses (when user taps notification)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle notification tap - navigate to order details, etc.
      handleNotificationResponse(response);
    });

    return () => {
      // Notifications.removeNotificationSubscription(notificationListener);
      // Notifications.removeNotificationSubscription(responseListener);
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;

    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
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
          console.log('Failed to get push token for push notification!');
          return;
        }
  
        // For prebuilt apps, get FCM token
        token = (await Notifications.getDevicePushTokenAsync()).data;
        console.log('FCM token:', token);
      } else {
        console.log('Must use physical device for Push Notifications');
      }
  
      setFcmToken(token);
      
      // Store token in AsyncStorage
      if (token) {
        await AsyncStorage.setItem('@fcm_token', token);
      }
    } catch (error) {
      console.log('Error registering for push notifications:', error);
    }
  };

  const updateFCMTokenOnServer = async (userId) => {
    try {
      if (!fcmToken) return;
      
      const response = await axios.put(`/update-fcm-token/${userId}`, {
        fcmToken: fcmToken,
      });
      
      if (response.data.success) {
        console.log('FCM token updated on server');
      }
    } catch (error) {
      console.error('Error updating FCM token on server:', error);
    }
  };

  const handleNotificationResponse = (response) => {
    const  data  = response.notification.request.content.data;
    // const { orderId } = data.orderId
    // console.log("OrderId in context: ",orderId);

    if (data.click_action === 'OPEN_ORDER_DETAILS'){
      // router.push(data.route,{params: orderId});
      router.push(data.route);
    }

    if (data.type === 'order_status_update') {
      // Navigate to order details or show order status
      console.log('Order status update notification tapped:', data);
      // You can add navigation logic here
    }
  };

  // const sendLocalNotification = async (title, body, data = {}) => {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title,
  //       body,
  //       data,
  //     },
  //     trigger: null, // Send immediately
  //   });
  // };

  const value = {
    fcmToken,
    notification,
    updateFCMTokenOnServer,
    // sendLocalNotification,
  };

  return (
    <PushNotificationContext.Provider value={value}>
      {children}
    </PushNotificationContext.Provider>
  );
};
