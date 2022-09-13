import React from "react";
import Footer from "../../Footer";
import { useParams } from "react-router-dom";
import "./style.css";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { firebaseDatabase } from "../../../database/firebaseConfig";
import { initializeApp } from "firebase/app";

type blogDetailsDataType = {
  id: string;
  title: string;
  description: string;
  blogImage: string;
  icon: string;
  date: string;
};

const BlogDetails: React.FC = () => {
  // const [selected, setSelected] = React.useState(images[0].bannerImage);
  // console.log(images[0]);
  const [blog, setBlog] = React.useState<blogDetailsDataType>();
  const { id } = useParams();

  const getData = async () => {
    const db = getFirestore();
    const docRef = doc(db, "blog", `${id}`);
    const docSnap = await getDoc(docRef);
    docSnap.data();
    try {
      const docSnap = await getDoc(docRef);
      const results = docSnap.data();
      // console.log(results);
      let obj: blogDetailsDataType = {
        id: results?.id,
        title: results?.title,
        description: results?.description,
        blogImage: results?.blogImage,
        icon: results?.icon,
        date: results?.date,
      };
      setBlog(obj);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <React.Fragment>
      <div className="blogDetails">
        <div className="blogDetails__image">
          <div className="blogDetails__image__main">
            <img
              src={blog?.blogImage}
              className="blogDetails__image__main--selected"
              alt="Blog Images"
            />
          </div>
        </div>
        <div className="blogDetails__image__sub">
          {/* {images.map((img) => (
            <img
              style={{
                border:
                  selected === img.bannerImage ? "2px solid cadetblue" : "",
              }}
              src={img.bannerImage}
              alt="Blog Images"
              onClick={() => setSelected(img.bannerImage)}
            />
          ))} */}
        </div>
        <div className="blogDetails__details">
          <h3>{blog?.title}</h3>
          <p>{blog?.date.toString()}</p>
          <p>{blog?.description}</p>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default BlogDetails;
