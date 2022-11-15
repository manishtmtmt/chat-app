import React, { useState, useRef } from "react";
import { Button, Message, Modal, toaster } from "rsuite";
import AvatarEditor from "react-avatar-editor";
import { useModalState } from "../../misc/custom-hooks";
import { useProfile } from "../../context/profile.context";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { database, storage } from "../../misc/firebase.config";
import { getUserUpdates } from "../../misc/helpers";
import { update, ref as dbRef } from "firebase/database";
import ProfileAvatar from "../ProfileAvatar";

const fileInputTypes = ".png, .jpeg, .jpg";

const acceptedFileTypes = ["image/png", "image/jpeg", "image/pjpeg"];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);

const getBlob = (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("File process error"));
      }
    });
  });
};

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState(null);
  const avatarEditorRef = useRef();

  const onFileInputChange = (ev) => {
    const currentFiles = ev.target.files;
    // console.log(currentFiles);

    if (currentFiles.length === 1) {
      const file = currentFiles[0];

      if (isValidFile(file)) {
        setImg(file);
        open();
      } else {
        toaster.push(
          <Message type="warning" duration={4000} closable>
            {`Wrong file type ${file.type}`}
          </Message>
        );
      }
    }
  };

  const onUploadClick = async () => {
    const canvas = avatarEditorRef.current.getImageScaledToCanvas();

    setIsLoading(true);

    try {
      const blob = await getBlob(canvas);

      const avatarFileRef = storageRef(storage, `/users/${profile.uid}/avatar`);

      await uploadBytes(avatarFileRef, blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });

      const downloadUrl = await getDownloadURL(avatarFileRef);

      const updates = await getUserUpdates(
        profile.uid,
        "avatar",
        downloadUrl,
        database
      );

      await update(dbRef(database), updates);

      setIsLoading(false);
      toaster.push(
        <Message type="info" closable duration={4000}>
          Avatar has been uploaded
        </Message>
      );
      close();
    } catch (error) {
      setIsLoading(false);
      toaster.push(
        <Message type="error" closable duration={4000}>
          {error}
        </Message>
      );
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar
        src={profile.avatar}
        name={profile.name}
        className="width-200 height-200 img-fullsize font-huge"
      />

      <div>
        <label
          htmlFor="avatar-upload"
          className="d-block cursor-pointer padded"
        >
          Select new avatar
          <input
            type="file"
            className="d-none"
            id="avatar-upload"
            accept={fileInputTypes}
            onChange={(e) => onFileInputChange(e)}
          />
        </label>

        <Modal open={isOpen} onClose={close}>
          <Modal.Header>
            <Modal.Title>Adjust and upload new avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {img && (
                <AvatarEditor
                  ref={avatarEditorRef}
                  image={img}
                  width={200}
                  height={200}
                  border={10}
                  borderRadius={100}
                  rotate={0}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              block
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
