import { useState } from "react";
import {
  auth,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "../lib/firebase";
import Loader from "./Loader";

export default function ImageUploader({}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadFile = async (e: any) => {
    const file: any = Array.from(e.target.files)[0];
    const extension = file.type;

    const sRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    const task = uploadBytesResumable(sRef, file);
    task.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {},
      () => {
        getDownloadURL(task.snapshot.ref).then((downloadURL) => {
          setDownloadURL(downloadURL);
          setUploading(false);
        });
      }
    );
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {!uploading && (
        <>
          <label className="btn">
            Upload Img
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png, image/gif, image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}
