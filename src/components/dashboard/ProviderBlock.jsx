import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  linkWithPopup,
  unlink,
} from "firebase/auth";
import React, { useState } from "react";
import { Button, Message, Tag, toaster } from "rsuite";
import { auth } from "../../misc/firebase.config";
import FacebookOfficialIcon from "@rsuite/icons/legacy/FacebookOfficial";
import GoogleOfficialIcon from "@rsuite/icons/legacy/Google";

const ProviderBlock = () => {
  const [isConnected, setIsConnected] = useState({
    "google.com": auth.currentUser.providerData.some(
      (data) => data.providerId === "google.com"
    ),
    "facebook.com": auth.currentUser.providerData.some(
      (data) => data.providerId === "facebook.com"
    ),
  });

  const updateIsConnected = (providerId, value) => {
    setIsConnected((p) => {
      return {
        ...p,
        [providerId]: value,
      };
    });
  };

  const unlinkProvider = async (providerId) => {
    try {
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`You can not disconnect from ${providerId}`);
      }

      await unlink(auth.currentUser, providerId);
      updateIsConnected(providerId, false);
      toaster.push(
        <Message type="info" closable duration={4000}>
          {`Disconnected from ${providerId}`}
        </Message>
      );
    } catch (err) {
      toaster.push(
        <Message type="error" closable duration={4000}>
          {err.message}
        </Message>
      );
    }
  };

  const unlinkFacebook = () => {
    unlinkProvider("facebook.com");
  };
  const unlinkGoogle = () => {
    unlinkProvider("google.com");
  };

  const linkProvider = async (provider) => {
    try {
      await linkWithPopup(auth.currentUser, provider);
      toaster.push(
        <Message type="info" closable duration={4000}>
          {`Linked to ${provider.providerId}`}
        </Message>
      );
      updateIsConnected(provider.providerId, true);
    } catch (err) {
      toaster.push(
        <Message type="error" closable duration={4000}>
          {err.message}
        </Message>
      );
    }
  };

  const linkFacebook = () => {
    linkProvider(new FacebookAuthProvider());
  };
  const linkGoogle = () => {
    linkProvider(new GoogleAuthProvider());
  };

  return (
    <div>
      {isConnected["google.com"] && (
        <Tag color="green" closable onClose={unlinkGoogle} appearance="primary">
          <GoogleOfficialIcon /> Connected
        </Tag>
      )}
      {isConnected["facebook.com"] && (
        <Tag
          color="blue"
          closable
          onClose={unlinkFacebook}
          appearance="primary"
        >
          <FacebookOfficialIcon /> Connected
        </Tag>
      )}

      <div className="mt-2">
        {!isConnected["google.com"] && (
          <Button block color="green" onClick={linkGoogle} appearance="primary">
            <GoogleOfficialIcon /> Link to Google
          </Button>
        )}

        {!isConnected["facebook.com"] && (
          <Button
            block
            color="blue"
            onClick={linkFacebook}
            appearance="primary"
          >
            <FacebookOfficialIcon /> Link to Facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProviderBlock;
