import React from "react";
import { Button, Drawer } from "rsuite";
import DashboardIcon from "@rsuite/icons/Dashboard";
import { useModalState } from "../../misc/custom-hooks";
import Dashboard from ".";

const DashboardToggle = () => {

    const { isOpen, close, open } = useModalState()

  return (
    <>
      <Button block color="blue" appearance="primary" onClick={open}>
        <DashboardIcon /> Dashboard
      </Button>
      <Drawer open={isOpen} onClose={close} placement="left">
        <Dashboard />
      </Drawer>
    </>
  );
};

export default DashboardToggle;
