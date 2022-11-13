import React from "react";
import { Button, Divider, Drawer } from "rsuite";
import { useProfile } from "../../context/profile.context";
import EditableInput from "../EditableInput";

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();

  const onSave = async (newData) => {
    console.log(newData)
  };

  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <div style={{ height: "90%" }}>
          <h3>Hey, {profile.name}</h3>
          <Divider />
          <EditableInput
            name="nickname"
            initialValue={profile.name}
            onSave={onSave}
            label={<h6 className="mb-2">Nickname</h6>}
          />
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
