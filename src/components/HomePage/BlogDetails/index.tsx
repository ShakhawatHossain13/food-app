import React from "react";
import Footer from "../../Footer";
import { useParams } from "react-router-dom";
import "./style.css";
import Backdrop from "../../Backdrop";
import { getFirestore, getDoc, doc } from "firebase/firestore";

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
  const [blog, setBlog] = React.useState<blogDetailsDataType>();
  const [backdrop, setBackdrop] = React.useState<Boolean>(true);
  const { id } = useParams();

  // ============================== Methods =========================

  /**
   * Returns specific single blog details
   */
  const getData = async () => {
    const db = getFirestore();
    const docRef = doc(db, "blog", `${id}`);
    const docSnap = await getDoc(docRef);
    docSnap.data();
    try {
      const docSnap = await getDoc(docRef);
      const results = docSnap.data();
      let obj: blogDetailsDataType = {
        id: results?.id,
        title: results?.title,
        description: results?.description,
        blogImage: results?.blogImage,
        icon: results?.icon,
        date: results?.date,
      };
      setBlog(obj);
      setBackdrop(false);
    } catch (error) {
      console.log(error);
    }
  };

  //========================== Effects ========================

  React.useEffect(() => {
    setBackdrop(true);
    getData();
  }, []);

  return (
    <React.Fragment>
      {backdrop ? (
        <Backdrop />
      ) : (
        <>
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
            </div>
            <div className="blogDetails__details">
              <h3>{blog?.title}</h3>
              <p>{blog?.date.toString()}</p>
              <p>{blog?.description}</p>
            </div>
          </div>
          <Footer />
        </>
      )}
    </React.Fragment>
  );
};

export default BlogDetails;
