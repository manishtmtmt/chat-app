import React, { useState } from "react";
import { Button, Message, Modal, toaster } from "rsuite";
import { useModalState } from "../../misc/custom-hooks";
import AvatarEditor from "react-avatar-editor";

const fileInputTypes = ".png, .jpeg, .jpg";

const acceptedFileTypes = ["image/png", "image/jpeg", "image/pjpeg"];
const isValidFile = (file) => acceptedFileTypes.includes(file.type);

const AvatarUploadBtn = () => {
  const { isOpen, open, close } = useModalState();
  const [img, setImg] = useState(null);

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

  return (
    <div className="mt-3 text-center">
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
                  // ref={avatarEditorRef}
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
            <Button block appearance="ghost">
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUploadBtn;
