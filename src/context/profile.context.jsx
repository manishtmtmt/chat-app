import { onAuthStateChanged } from "firebase/auth";
import {
  off,
  onValue,
  ref,
  serverTimestamp,
  onDisconnect,
  set,
} from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  database,
  messaging,
  fcmVapidKey,
} from "../misc/firebase.config";
import { getToken } from "firebase/messaging";

export const isOfflineForDatabase = {
  state: "offline",
  last_changed: serverTimestamp(),
};

const isOnlineForDatabase = {
  state: "online",
  last_changed: serverTimestamp(),
};

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // console.log(profile)

  useEffect(() => {
    let userRef;
    let userStatusRef;

    const authUnsub = onAuthStateChanged(auth, async (authObj) => {
      if (authObj) {
        userStatusRef = ref(database, `/status/${authObj.uid}`);
        userRef = ref(database, `/users/${authObj.uid}`);

        onValue(userRef, (snap) => {
          const { name, createdAt, avatar } = snap.val();

          const data = {
            name,
            createdAt,
            avatar,
            uid: authObj.uid,
            email: authObj.email,
          };

          setProfile(data);
          setIsLoading(false);
        });

        onValue(ref(database, ".info/connected"), (snapshot) => {
          if (!!snapshot.val() === false) {
            return;
          }

          onDisconnect(userStatusRef)
            .set(isOfflineForDatabase)
            .then(() => {
              set(userStatusRef, isOnlineForDatabase);
            });
        });

        if (messaging) {
          try {
            const currentToken = await getToken(messaging, {
              vapidKey: fcmVapidKey,
            });
            if (currentToken) {
              await set(
                ref(database, `/fcm_tokens/${currentToken}`),
                authObj.uid
              );
            }
          } catch (err) {
            console.log("An error occurred while retrieving token. ", err);
          }
        }
      } else {
        if (userRef) {
          off(userRef);
        }

        if (userStatusRef) {
          off(userStatusRef);
        }

        off(ref(database, ".info/connected"));

        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      authUnsub();

      off(ref(database, ".info/connected"));

      if (userRef) {
        off(userRef);
      }

      if (userStatusRef) {
        off(userStatusRef);
      }
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
