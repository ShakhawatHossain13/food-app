import React from "react";
import Footer from "../../Footer";
import { images } from "./blogdetailsimages";
import "./style.css";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc, 
} from "firebase/firestore";
import { firebaseDatabase } from "../../../database/firebaseConfig"; 

type BlogDetailsDataType = {
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
    const [blog, setblog] = React.useState<BlogDetailsDataType[]>([]);
    const getData = async () => {
    const colRef = collection(firebaseDatabase, "blog");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: BlogDetailsDataType  = {       
          id: temp.id,   
          title: temp.title,
          description: temp.description,
          blogImage: temp.blogImage,
          icon: temp.icon,
          date: temp.date,
        };
        return obj;
      });
      setblog(prepareData);   
      return prepareData;
    } catch (error) {
      console.log(error);
    }
  };
  
  React.useEffect(() => {
    getData();
  }, []);

  console.log(blog)
  
  return (
    <React.Fragment>
      <div className="blogdetails">
        <div className="blogdetails__image">
          <div className="blogdetails__image__main">
        hello
            <img
              src={blog[0].blogImage}
              className="blogdetails__image__main--selected"
              alt="selected"
            />
          </div>
        </div>
        <div className="blogdetails__image__sub">
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
        <div className="blogdetails__details">
          {/* <h3>{blog[0].title}</h3>
          <p>{blog[0].date}</p>
          <p>{blog[0].description}</p> */}
        </div>
      </div>
       <Footer />
    </React.Fragment>
  );
};

export default BlogDetails;
