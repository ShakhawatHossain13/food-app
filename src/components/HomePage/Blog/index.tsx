import React from "react";
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

type BlogFilterDataType = {
  id: string;
  title: string;
  description: string;
  blogImage: string;
  icon: string;
  date: string;
};
const Blog: React.FC = () => {
  const [blog, setblog] = React.useState<BlogFilterDataType[]>([]);

  const getData = async () => {
    const colRef = collection(firebaseDatabase, "blog");
    try {
      const result = await getDocs(colRef);
      const prepareData = result?.docs.map((item) => {
        let temp = item.data();
        let obj: BlogFilterDataType = {
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

  return (
    <React.Fragment>
      <section className="blog">
        <h1 className="blog__title">Why you choose Us</h1>
        <p className="blog__subtext">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard.
        </p>
        <div className="blog__row">
          {blog?.slice(0, 3).map((post) => {
            return (
              <div className="blog__card">
                <img
                  className="blog__card__image"
                  src={post?.blogImage}
                  alt="Food Images"
                />
                <div className="blog__card__body">
                  <div className="blog__card__body__icon">
                    <img
                      className="blog__card__body__icon__image"
                      src={post?.icon}
                      alt="Food Images"
                    />
                  </div>
                  <div className="blog__card__body__details">
                    <p className="blog__card__body__details__title">
                      {post?.title}
                    </p>
                    <div className="blog__card__body__details__description">
                      <p>{post?.description.slice(0, 100)}...</p>
                    </div>
                    {/* <a href = {`/blogdetails/${post?.id.trim()}`} >See More...</a> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </React.Fragment>
  );
};

export default Blog;
