import React from "react";
import { FaCheck } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebaseConfig";

type uploadImageProps = {
  idRef?: string;
  setImgUrls: any;
};

const UploadImage = ({ idRef, setImgUrls }: uploadImageProps) => {
  const [images, setImages] = React.useState([]);
  const [displayImages, setDisplayImages] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState(displayImages[0]);

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
              maxWidth: "200px",
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
        // () => {
        //   getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //     setImgUrls((prevState): any => [...prevState, downloadURL]);
        //   });
        // }
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            if (downloadURL) {
              setImgUrls(downloadURL);
            }           
          });
        }
      );
    });

    Promise.all(promises)
      .then(() => alert("All images uploaded"))
      .catch((err) => console.log(err)); 
  };

  console.log("images: ", images);
  console.log("Doc ID: ", idRef);
 
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
          />
        </div>

        <div className="image__preview" >
          {renderImages()}
        </div>
        <button onClick={handleUpload} type="submit" style={{marginTop: "10px", width: "100%", backgroundColor: "darkseagreen", padding: "5px 0", border: "1px solid cadetblue"}}>
          Upload
        </button>
      </div>
    </React.Fragment>
  );
};

export default UploadImage;
