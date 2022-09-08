import React from "react";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { firebaseDatabase } from "../firebaseConfig";

type CRUDProps = {
  title: string;
  description: string;
};

export const getData = async () => {
  const colRef = collection(firebaseDatabase, "blog");
  try {
    const result = await getDocs(colRef);
    const prepareData = result?.docs.map((item) => {
      let temp = item.data();
      let obj: CRUDProps = {
        title: temp.title,
        description: temp.description,
      };
      return obj;
    });
    console.log(prepareData);

    return prepareData;
  } catch (error) {
    console.log(error);
  }
};

const Blog = () => {
  const [blog, setBlog] = React.useState<CRUDProps>({
    title: "",
    description: "",
  });

  const [data, setData] = React.useState([]);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlog((prev) => ({
      ...prev,
      title: event.target.value,
    }));
  };

  const handleDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBlog((prev) => ({
      ...prev,
      description: event.target.value,
    }));
  };

  const handleInsert = () => {
    const colRef = collection(firebaseDatabase, "blog");
    addDoc(colRef, {
      title: blog.title,
      description: blog.description,
    });
  };
  const handleDelete = () => {
    console.log("delete");
    console.log(blog.title);
    const colRef = doc(firebaseDatabase, "blog", blog.title);
    deleteDoc(colRef).then(() => {});
  };

  const getID = getData();
  console.log(getID);

  return (
    <>
      <form>
        <label>Title</label>
        <input id="title" name="title" onChange={handleTitle} />
        <br />

        <label>Description</label>
        <input
          id="description"
          name="description"
          onChange={handleDescription}
        />

        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            handleInsert();
          }}
        >
          Add
        </button>
      </form>

      <form>
        <label>Title</label>
        <input id="title" name="title" onChange={handleTitle} />
        <br />

        <button
          type="submit"
          onClick={(event) => {
            event.preventDefault();
            handleDelete();
          }}
        >
          Delete
        </button>
      </form>

      <div>
        <ul>
          <li>
            <p>Title: </p>
            <p>Description: </p>
            <button onClick={handleDelete}>Delete</button>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Blog;
