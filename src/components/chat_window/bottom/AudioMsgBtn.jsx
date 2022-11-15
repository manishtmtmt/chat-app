import React, { useState, useCallback } from "react";
import { InputGroup, Message, toaster } from "rsuite";
import { ReactMic } from "react-mic";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../misc/firebase.config";
import { useParams } from "react-router";

const AudioMsgBtn = ({ afterUpload }) => {
  const { chatId } = useParams();

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const onClick = useCallback(() => {
    setIsRecording((p) => !p);
  }, []);

  const onUpload = useCallback(
    async (data) => {
      setIsUploading(true);
      try {
        const snap = await uploadBytes(
          ref(storage, `/chat/${chatId}/audio_${Date.now()}.mp3`),
          data.blob,
          {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          }
        );

        const file = {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await getDownloadURL(snap.ref),
        };

        setIsUploading(false);
        afterUpload([file]);
      } catch (error) {
        setIsUploading(false);
        toaster.push(
          <Message type="error" closable duration={4000}>{error.message}</Message>
        )
      }
    },
    [afterUpload, chatId]
  );

  return (
    <InputGroup.Button
      onClick={onClick}
      disabled={isUploading}
      className={isRecording ? "animate-blink" : ""}
    >
      <i className="fa-solid fa-microphone"></i>
      <ReactMic
        record={isRecording}
        className="d-none"
        onStop={onUpload}
        mimeType="audio/mp3"
      />
    </InputGroup.Button>
  );
};

export default AudioMsgBtn;
