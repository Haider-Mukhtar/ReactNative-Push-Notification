import {Alert, Button, Platform, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {PermissionsAndroid} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';

const App = () => {
  const getFCMToken = async () => {
    const token = await messaging().getToken();
    console.log('FCM Token: ', token);
  };

  const requestPermissionAndroid = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('✔ Permissions Granted (Android)');
      getFCMToken();
    } else {
      console.log('❌ Permissions Denied (Android)');
    }
  };

  const requestPermissionIOS = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      console.log('Authorization status (IOS):', authStatus);
    }
  };

  const onDisplayNotification = async (remoteMessage: any) => {
    // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

    // Display a notification
    await notifee.displayNotification({
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      android: {
        channelId,
        // smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  const onDisplayNotificationTest = async () => {
    // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });

    // Display a notification
    await notifee.displayNotification({
      title: 'Test Notification',
      body: 'This is a test Foreground Notification.',
      android: {
        channelId,
        smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
        // pressAction is needed if you want the notification to open the app when pressed
        pressAction: {
          id: 'default',
        },
      },
    });
  }

  // Forground Notifications
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      onDisplayNotification(remoteMessage);
      // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  // Request Permissions
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestPermissionAndroid();
    } else if (Platform.OS === 'ios') {
      requestPermissionIOS();
    } else {
      console.log('This OS not supported.');
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
      }}>
      <Text style={{color: '#FFFFFF', fontSize: 28, fontWeight:'bold'}}>
        Firebase Notifications
      </Text>
      <Text style={{color: '#FFFFFF', fontSize: 28, marginBottom: 40, fontWeight:'bold'}}>
        (Android)
      </Text>
      <Text style={{color: '#FFFFFF', fontSize: 24,marginBottom: 10,}}>
        Foreground Notifications
      </Text>
      <Button onPress={() => onDisplayNotificationTest()} title='Send Test Notifee Notification'></Button>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({});
