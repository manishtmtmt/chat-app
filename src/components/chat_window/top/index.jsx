import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useCurrentRoom } from "../../../context/current-room.context";
import ArowBackIcon from '@rsuite/icons/ArowBack';
import { useMediaQuery } from "../../../misc/custom-hooks";
import { ButtonToolbar } from "rsuite";
import RoomInfoBtnModal from "./RoomInfoBtnModal";

const ChatTop = () => {
  const name = useCurrentRoom((v) => v.name);
  const isMobile = useMediaQuery("(max-width: 992px)");

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4>
          <Link to={"/"} className="link-unstyled">
            <ArowBackIcon
              className={isMobile ? "d-inline-block p-0 mr-2 text-blue" : "d-none"}
            />
          </Link>
          <span className="text-disappear">{name}</span>
        </h4>

        <ButtonToolbar className="ws-nowrap">Todo</ButtonToolbar>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span>todo</span>
        <RoomInfoBtnModal />
      </div>
    </div>
  );
};

export default memo(ChatTop);
