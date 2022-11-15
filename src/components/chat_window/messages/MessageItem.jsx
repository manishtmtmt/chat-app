import React, { memo } from "react";
import TimeAgo from "timeago-react";
import ProfileAvatar from "../../ProfileAvatar";
import ProfileInfoBtnModal from "./ProfileInfoBtnModal";

const MessageItem = ({ message }) => {
  const { author, createdAt, text } = message;

  return (
    <li className={`padded mb-1 cursor-pointer`}>
      <div className="d-flex align-items-center font-bolder mb-1">
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="ml-1"
          size="xs"
        />
        <ProfileInfoBtnModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        />
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
      </div>

      <div>{text && <span className="word-break-all">{text}</span>}</div>
    </li>
  );
};

export default memo(MessageItem);
