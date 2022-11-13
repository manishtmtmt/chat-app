import { onAuthStateChanged } from "firebase/auth";
import { off, onValue, ref } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, database } from "../misc/firebase.config";

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
          const { name, createdAt } = snap.val();

          const data = {
            name,
            createdAt,
            uid: authObj.uid,
            email: authObj.email,
          };

          setProfile(data);
          setIsLoading(false);
        });
      } else {
        if (userRef) {
          off(userRef);
        }

        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      authUnsub();

      if (userRef) {
        off(userRef);
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
