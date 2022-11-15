import React, { useState } from "react";
import { useParams } from "react-router";
import { Button, InputGroup, Message, Modal, toaster, Uploader } from "rsuite";
import { useModalState } from "../../../misc/custom-hooks";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../misc/firebase.config";

const MAX_FILE_SIZE = 1000 * 1024 * 5;

const AttchmentBtnModal = ({ afterUpload }) => {
  const { chatId } = useParams();
  const { isOpen, open, close } = useModalState();

  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (fileArr) => {
    const filtered = fileArr
      .filter((el) => el.blobFile.size <= MAX_FILE_SIZE)
      .slice(0, 5);

    setFileList(filtered);
  };

  const onUpload = async () => {
    try {
      const uploadPromises = fileList.map((f) => {
        return uploadBytes(
          ref(storage, `/chat/${chatId}/${Date.now() + f.name}`),
          f.blobFile,
          {
            cacheControl: `public, max-age=${3600 * 24 * 3}`,
          }
        );
      });

      const uploadSnapshots = await Promise.all(uploadPromises);

      const shapePromises = uploadSnapshots.map(async (snap) => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await getDownloadURL(snap.ref),
        };
      });

      const files = await Promise.all(shapePromises);

      await afterUpload(files);

      setIsLoading(false);
      close();
    } catch (err) {
      setIsLoading(false);
      toaster.push(
        <Message type="error" closable duration={4000}>
          {err.message}
        </Message>
      );
    }
  };

  return (
    <>
      <InputGroup.Button onClick={open}>
        <i className="fa-solid fa-paperclip"></i>
      </InputGroup.Button>

      <Modal open={isOpen} onClose={close}>
        <Modal.Header>
          <Modal.Title>Upload files</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Uploader
            autoUpload={false}
            action=""
            fileList={fileList}
            onChange={onChange}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            block
            appearance="primary"
            disabled={isLoading}
            onClick={onUpload}
          >
            Send to chat
          </Button>
          <div className="text-right mt-2">
            <small>* only files less than 5 mb are allowed</small>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AttchmentBtnModal;
