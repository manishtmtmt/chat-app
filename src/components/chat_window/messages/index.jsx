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
  update,
} from "firebase/database";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { auth, database, storage } from "../../../misc/firebase.config";
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
      query(messagesRef, orderByChild("roomId"), equalTo(chatId)),
      (snap) => {
        const data = transformToArrWithId(snap.val());
        setMessages(data);
      }
    );

    return () => {
      off(messagesRef);
    };
  }, [chatId]);

  const handleAdmin = useCallback(
    async (uid) => {
      let alertMsg;

      await runTransaction(
        dbRef(database, `/rooms/${chatId}/admins`),
        (admins) => {
          if (admins) {
            if (admins[uid]) {
              admins[uid] = null;
              alertMsg = "Admin permission removed";
            } else {
              admins[uid] = true;
              alertMsg = "Admin permission granted";
            }
          }
          return admins;
        }
      );

      toaster.push(
        <Message type="info" closable duration={4000}>
          {alertMsg}
        </Message>
      );
    },
    [chatId]
  );

  const handleLike = useCallback(async (msgId) => {
    const { uid } = auth.currentUser;
    const messageRef = dbRef(database, `/messages/${msgId}`);

    let alertMsg;

    await runTransaction(messageRef, (msg) => {
      if (msg) {
        if (msg.likes && msg.likes[uid]) {
          msg.likeCount -= 1;
          msg.likes[uid] = null;
          alertMsg = "Like removed";
        } else {
          msg.likeCount += 1;

          if (!msg.likes) {
            msg.likes = {};
          }

          msg.likes[uid] = true;
          alertMsg = "Like added";
        }
      }

      return msg;
    });

    toaster.push(
      <Message type="info" closable duration={4000}>
        {alertMsg}
      </Message>
    );
  }, []);

  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm("Delete this message?")) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;

      const updates = {};

      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await update(dbRef(database), updates);

        toaster.push(
          <Message type="info" closable duration={4000}>
            Message has been deleted
          </Message>
        );
      } catch (err) {
        return toaster.push(
          <Message type="error" closable duration={4000}>
            {err.message}
          </Message>
        );
      }

      if (file) {
        try {
          const fileRef = storageRef(storage, file.url);
          await deleteObject(fileRef);
        } catch (err) {
          toaster.push(
            <Message type="error" closable duration={4000}>
              {err.message}
            </Message>
          );
        }
      }
    },
    [chatId, messages]
  );

  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {isChatEmpty && <li>No messages yet</li>}
      {canShowMessages &&
        messages.map((msg) => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdmin={handleAdmin}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </ul>
  );
};

export default Messages;
