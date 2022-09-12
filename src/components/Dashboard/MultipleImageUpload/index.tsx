import React from "react";
import "./style.css";
import { FaCheck } from "react-icons/fa";
import { storage } from "../../../database/firebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firebaseDatabase } from "../../../database/firebaseConfig";

const MultipleImageUpload: React.FC = () => {
  const [images, setImages] = React.useState([]);
  const [displayImages, setDisplayImages] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState(displayImages[0]);
  const [imgUrls, setImgUrls] = React.useState([]);
  const [progress, setProgress] = React.useState<number>(0);

  const imageHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setDisplayImages(fileArray);
    }
  };
  const handleChange = (e: any) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState): any => [...prevState, newImage]);
    }
  };

  const renderImages = () => {
    return displayImages.map((photo) => {
      return (
        <>
          <img
            src={photo}
            key={photo}
            onClick={() => setSelected(photo)}
            style={{
              border: selected === photo ? "2px solid cadetblue" : "",
            }}
            alt="Images"
          />
          {selected === photo && (
            <FaCheck className="image__tick" size="15px" />
          )}
        </>
      );
    });
  };

  const sendImages = async () => {
    const db = getFirestore();
    const docRef = doc(db, "food", "OnDMiF520QIg9qlSO2Q9");
    const data = {
      foodImage: imgUrls,
    };

    updateDoc(docRef, data)
      .then((docRef) => {
        console.log("Images are added");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  console.log(imgUrls);

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

    sendImages();
  };

  console.log("images: ", images);
  // console.log("urls", imgUrls);

  return (
    <React.Fragment>
      <div className="image">
        <div>
          <input
            type="file"
            id="image"
            name="image"
            multiple
            onChange={(e) => {
              imageHandleChange(e);
              handleChange(e);
            }}
            style={{ width: "160px" }}
          />
        </div>

        <div className="image__preview">{renderImages()}</div>
        <button onClick={handleUpload} type="submit">
          Upload
        </button>        
      </div>
    </React.Fragment>
  );
};

export default MultipleImageUpload;
