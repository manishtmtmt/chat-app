import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import {
  ref as dbRef,
  off,
  onValue,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { database } from "../../../misc/firebase.config";
import { transformToArrWithId } from "../../../misc/helpers";
import MessageItem from "./MessageItem";

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

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages && messages.map(msg => <MessageItem key={msg.id} message={msg} />)}
    </ul>
  );
};

export default Messages;
