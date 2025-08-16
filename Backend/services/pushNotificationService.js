const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// You'll need to download your service account key from Firebase Console
// and place it in the project root or use environment variables
let serviceAccount;
try {
  serviceAccount = require('../firebase-service-account.json');
} catch (error) {
  // If service account file doesn't exist, try to use environment variables
  serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  };
}

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

// Send push notification to a specific user
const sendPushNotification = async (fcmToken, title, body, imageUrl= undefined, data = {}) => {
  try {
    if (!fcmToken) {
      console.log('No FCM token provided');
      return false;
    }
    
    const message = {
      notification: {
        title,
        body,
        imageUrl
      },
      data: {
        ...data,
        // click_action: 'FLUTTER_NOTIFICATION_CLICK',
        click_action: 'OPEN_ORDER_DETAILS',
        route: '/(profile)/yourOrder',
      },
      token: fcmToken,
      android: {
        priority: 'high',
        notification: {
          sound: 'default',
          priority: 'high',
          default_sound: true,
          default_vibrate_timings: true,
          default_light_settings: true,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    const response = await admin.messaging().send(message);
    // console.log('Successfully sent message:', response);
    return true;
  } catch (error) {
    console.error('Error sending push notification:', error);
    return false;
  }
};

// Send push notification to multiple users
// const sendPushNotificationToMultipleUsers = async (fcmTokens, title, body, data = {}) => {
//   try {
//     if (!fcmTokens || fcmTokens.length === 0) {
//       console.log('No FCM tokens provided');
//       return false;
//     }

//     const message = {
//       notification: {
//         title,
//         body,
//       },
//       data: {
//         ...data,
//         click_action: 'FLUTTER_NOTIFICATION_CLICK',
//       },
//       android: {
//         priority: 'high',
//         notification: {
//           sound: 'default',
//           priority: 'high',
//           default_sound: true,
//           default_vibrate_timings: true,
//           default_light_settings: true,
//         },
//       },
//       apns: {
//         payload: {
//           aps: {
//             sound: 'default',
//             badge: 1,
//           },
//         },
//       },
//     };

//     const response = await admin.messaging().sendMulticast({
//       tokens: fcmTokens,
//       ...message,
//     });

//     console.log('Successfully sent messages:', response);
//     return response;
//   } catch (error) {
//     console.error('Error sending push notifications:', error);
//     return false;
//   }
// };

module.exports = {
  sendPushNotification,
  // sendPushNotificationToMultipleUsers,
};
