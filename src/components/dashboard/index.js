import React, { Profiler } from "react";
import { Button, Drawer } from "rsuite";
import { useProfile } from "../../context/profile.context";

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <div style={{ height: "90%" }}>
          <h3>Hey, {profile.name}</h3>
        </div>
        <div style={{ height: "10%" }}>
          <Drawer.Actions>
            <Button block color="red" appearance="primary" onClick={onSignOut}>
              Sign Out
            </Button>
          </Drawer.Actions>
        </div>
      </Drawer.Body>
    </>
  );
};

export default Dashboard;
