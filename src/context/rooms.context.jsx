import { off, onValue, ref } from "firebase/database";
import React, { createContext, useContext, useEffect, useState } from "react";
import { database } from "../misc/firebase.config";
import { transformToArrWithId } from "../misc/helpers";

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState();

  useEffect(() => {
    const roomListRef = ref(database, "rooms");

    // subscribe to realtime database
    onValue(roomListRef, (snap) => {
      const data = transformToArrWithId(snap.val());
      setRooms(data);
    });

    // unsubscribe to realtime database
    return () => {
      off(roomListRef);
    };
  }, []);

  return (
    <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
