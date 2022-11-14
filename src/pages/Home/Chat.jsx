import React from "react";
import { useParams } from "react-router";

const Chat = () => {
  const { chatId } = useParams();
  return <div>{chatId}</div>;
};

export default Chat;
