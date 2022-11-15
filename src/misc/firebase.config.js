import { Notification as Toast } from 'rsuite'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getMessaging, isSupported, onMessage } from 'firebase/messaging';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { isLocalhost } from './helpers';

const config = {
  apiKey: "AIzaSyD2dL96se3yIXIPKOtvtTuPU4vPcmYknf8",
  authDomain: "chat-app-15798.firebaseapp.com",
  projectId: "chat-app-15798",
  storageBucket: "chat-app-15798.appspot.com",
  messagingSenderId: "159523893460",
  appId: "1:159523893460:web:068a680501040583488b41",
  databaseURL:
    "https://chat-app-15798-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

export const fcmVapidKey = 'BLs_I-HQyrAuUJJh8H3U0vtHGhVhXLMqoVoomeNL90GMKm0-o7sSoN9CJYRiBAVz-Yi7ZAni8mKateJfDwodTnw';

const app = initializeApp(config);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const functions = getFunctions(app, 'asia-southeast1');

export const messaging = isSupported() ? getMessaging(app) : null;

if (messaging) {
  onMessage(messaging, ({ notification }) => {
    const { title, body } = notification;
    Toast.info({ title, description: body, duration: 0 });
  });
}

if (isLocalhost) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}