import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";
import { storage } from "../firebaseConfig";

const ImageUpload = () => {
  const [images, setImages] = React.useState([]);
  const [imgUrls, setImgUrls] = React.useState([]);
  const [progress, setProgress] = React.useState<number>(0);

  const handleChange = (e: any) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState): any => [...prevState, newImage]);
    }
  };

  //   const handleUpload = (file: File) => {
  //     if (!file) {
  //       alert("Please select a image");
  //       return;
  //     }
  //     const storageRef = ref(storage, `/images/${file.name}`);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const prog = Math.round(
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100
  //         );
  //         setProgress(prog);
  //       },
  //       (err) => console.log(err),
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //           setImgUrls((prevState): any => [...prevState, downloadURL]);

  //           //   setImgUrls(downloadURL);
  //             console.log("File available at", downloadURL);
  //         });
  //       }
  //     );
  //   };
  //   console.log(images);
  //   console.log(imgUrls);

  const handleUpload = () => {
    const promises: any = [];
    images.map((image) => {
      const storageRef = ref(storage, `/images/${Math.random()}`);
      const uploadTask: any = uploadBytesResumable(storageRef, image);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
        (snapshot: any) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error: any) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImgUrls((prevState): any => [...prevState, downloadURL]);
          });
        }
      );
    });

    Promise.all(promises)
      .then(() => alert("All images uploaded"))
      .catch((err) => console.log(err));
  };

  // console.log("images: ", images);
  // console.log("urls", imgUrls);

  return (
    <React.Fragment>
      <div className="addBlog__row__form__row">
        <label className="addBlog__row__form__row__label">Upload Image</label>
        <input
          type="file"
          multiple
          id="image"
          name="image"
          onChange={handleChange}
          className="addBlog__row__form__row__input"
        />
        <button onClick={handleUpload} type="submit" style={{ cursor: "pointer"}}>
          Upload
        </button>
      </div>
      <span>Uploaded {progress} %</span>
    </React.Fragment>
  );
};

export default ImageUpload;
