import React, { memo } from "react";
import { useCurrentRoom } from "../../../context/current-room.context";

const ChatTop = () => {
  const name = useCurrentRoom((v) => v.name);

  return <div>{name}</div>;
};

export default memo(ChatTop);
