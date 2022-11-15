import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router";
import {
  ref as dbRef,
  off,
  onValue,
  query,
  orderByChild,
  equalTo,
  runTransaction,
} from "firebase/database";
import { database } from "../../../misc/firebase.config";
import { transformToArrWithId } from "../../../misc/helpers";
import MessageItem from "./MessageItem";
import { Message, toaster } from "rsuite";

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messagesRef = dbRef(database, "/messages");

    onValue(
      query(
        messagesRef,
        orderByChild('roomId'),
        equalTo(chatId),
      ),
      snap => {
        const data = transformToArrWithId(snap.val());
        setMessages(data);
      }
    );

      return () => {
        off(messagesRef)
      }
  }, [chatId]);

  const handleAdmin = useCallback(async (uid) => {
     let alertMsg;

     await runTransaction(dbRef(database, `/rooms/${chatId}/admins`), admins => {
      if(admins) {
        if(admins[uid]) {
          admins[uid] = null;
          alertMsg = 'Admin permission removed'
        } else {
          admins[uid] = true;
          alertMsg = "Admin permission granted"
        }
      }
      return admins;
     })

     toaster.push(
      <Message type="info" closable duration={4000}>
        {alertMsg}
      </Message>
     )
  }, [])

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && messages.map(msg => <MessageItem key={msg.id} message={msg} handleAdmin={handleAdmin} />)}
    </ul>
  );
};

export default Messages;
