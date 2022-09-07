import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { storage } from "../firebaseConfig";

const ImageUpload = () => {
  const [images, setImages] = React.useState();
  const [imgUrls, setImgUrls] = React.useState<string>("");
  const [progress, setProgress] = React.useState<number>(0);

  const handleChange = (e: any) => {
    if (e.target.files[0]) {
      setImages(e.target.files[0]);
    }
  };
  const uploadIcon = (file: File) => {
    if (!file) {
      alert("Please select a image");
      return;
    }
    const storageRef = ref(storage, `/images/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const prog = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(prog);
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImgUrls(downloadURL);
          console.log("File available at", downloadURL);
        });
      }
    );
  };
  console.log(imgUrls);

  const handleIconSubmit = (e: any) => {
    e.preventDefault();
    const file = e.target[0].files[0];
    uploadIcon(file);
  };

  return (
    <React.Fragment>
      <form onSubmit={handleIconSubmit}>
        <div className="addBlog__row__form__row">
          <label className="addBlog__row__form__row__label">Upload Icon</label>
          <input
            type="file"
            multiple
            id="icon"
            name="icon"
            onChange={handleChange}
            className="addBlog__row__form__row__input"
          />
          <button type="submit">Upload</button>
        </div>
      </form>
      <span>Uploaded {progress} %</span>
    </React.Fragment>
  );
};

export default ImageUpload;
