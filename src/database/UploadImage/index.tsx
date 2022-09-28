import React from "react";
import { FaCheck } from "react-icons/fa";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type uploadImageProps = {
  idRef?: string;
  setImgUrls: any;
};

const UploadImage = ({ idRef, setImgUrls }: uploadImageProps) => {
  const [images, setImages] = React.useState<any>();
  const [displayImages, setDisplayImages] = React.useState<string[]>([]);
  const [selected, setSelected] = React.useState(displayImages[0]);

  const [progress, setProgress] = React.useState<number>(0);

  // const imageHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const imageHandleChange = (e: any) => {
    // const FileExtension = e?.target?.files?[0].name?.split(".")[1].toLowerCase();
    // if (
    //   FileExtension === "jpeg" ||
    //   FileExtension === "jpg" ||
    //   FileExtension === "png"
    // ) {
    const fileArray = Array.from(e.target.files).map((file: any) =>
      URL.createObjectURL(file)
    );
    setDisplayImages(fileArray);
    // }
  };
  const handleChange = (e: any) => {
    const FileExtension = e.target.files[0].name.split(".")[1].toLowerCase();
    if (
      FileExtension === "jpeg" ||
      FileExtension === "jpg" ||
      FileExtension === "png"
    ) {
      const newImage = e.target.files[0];
      setImages(newImage);
    } else {
      const notifyAdd = () =>
        toast.error("Please upload a image on JPG, JPEG & PNG format");
      notifyAdd();
    }
  };

  /**
   * @returns show the image in the div section for preview
   */
  const renderImages = () => {
    return displayImages.map((photo, index) => {
      return (
        <div key={index}>
          <img
            src={photo}
            onClick={() => setSelected(photo)}
            style={{
              maxWidth: "100px",
              maxHeight: "60px",
              marginTop: "12px",
              border: "2px solid cadetblue",
              padding: "0 5px",
            }}
            alt="Images"
          />
          {selected === photo && (
            <FaCheck className="image__tick" size="15px" />
          )}
        </div>
      );
    });
  };

  const handleUpload = (e: any) => {
    // e.preventDefault();
    if (images) {
      const promises: any = [];
      const storageRef = ref(storage, `/images/${Math.random()}`);
      const uploadTask: any = uploadBytesResumable(storageRef, images);
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
            console.log("File available at", downloadURL);
            if (downloadURL) {
              setImgUrls(downloadURL);
            }
          });
        }
      );

      Promise.all(promises)
        .then(() => {
          console.log("Image uploaded successfully");
        })
        .catch((err) => console.log(err));
    } else {
      const notifyAdd = () => toast.error("Please upload Image!");
      notifyAdd();
    }
  };

  console.log("images: ", images);
  console.log("Doc ID: ", idRef);

  return (
    <React.Fragment>
      <div className="image">
        <div>
          <input
            type="file"
            accept="image/*"
            id="image"
            name="image"
            onChange={(e) => {
              imageHandleChange(e);
              handleChange(e);
            }}
          />
        </div>

        <div className="image__preview">{renderImages()}</div>
        {/* <button
          onClick={handleUpload}
          // type="submit"
          style={{
            marginTop: "10px",
            width: "100%",
            backgroundColor: "darkseagreen",
            padding: "5px 0",
            border: "1px solid cadetblue",
            cursor: "pointer",
          }}
        >
          Upload
        </button> */}
      </div>
    </React.Fragment>
  );
};

export default UploadImage;
