import React, { useCallback, useState } from "react";
import { Input, InputGroup, Message, toaster } from "rsuite";
import SendIcon from "@rsuite/icons/Send";
import { serverTimestamp, ref, push, update } from "firebase/database";
import { useParams } from "react-router";
import { useProfile } from "../../../context/profile.context";
import { database } from "../../../misc/firebase.config";
import AttchmentBtnModal from "./AttchmentBtnModal";
import AudioMsgBtn from "./AudioMsgBtn";

function assembleMessage(profile, chatId) {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: serverTimestamp(),
    likeCount: 0,
  };
}

const ChatBottom = () => {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { chatId } = useParams();
  const { profile } = useProfile();

  const onInputChange = useCallback((value) => {
    setInput(value);
  }, []);

  const onSendClick = async () => {
    if (input.trim() === "") return;

    const msgData = assembleMessage(profile, chatId);
    msgData.text = input;

    const updates = {};

    const messageId = push(ref(database, "messages")).key;

    updates[`/messages/${messageId}`] = msgData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...msgData,
      msgId: messageId,
    };

    setIsLoading(true);

    try {
      await update(ref(database), updates);

      setInput("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toaster.push(
        <Message type="error" closable duration={4000}>
          {error.message}
        </Message>
      );
    }
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onSendClick();
    }
  };

  const afterUpload = useCallback(
    async (files) => {
      setIsLoading(true);

      const updates = {};

      files.forEach((file) => {
        const msgData = assembleMessage(profile, chatId);
        msgData.file = file;

        const messageId = push(ref(database, "messages")).key;

        updates[`/messages/${messageId}`] = msgData;
      });

      const lastMsgId = Object.keys(updates).pop();

      updates[`/rooms/${chatId}/lastMessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await update(ref(database), updates);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        toaster.push(
          <Message type="error" closable duration={4000}>
            {err.message}
          </Message>
        );
      }
    },
    [profile, chatId]
  );

  return (
    <div>
      <InputGroup>
        <AttchmentBtnModal afterUpload={afterUpload} />
        <AudioMsgBtn afterUpload={afterUpload} />
        <Input
          placeholder="Write a new message here..."
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <SendIcon />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default ChatBottom;
