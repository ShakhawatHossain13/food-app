import React from "react";
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseDatabase } from "../firebaseConfig";

type CRUDProps = {
  title: string;
  description: string;
};

const getData = async () => {
  console.log("something");

  const colRef = collection(firebaseDatabase, "blog");
  try {
    const result = await getDocs(colRef);

    const prepareData = result?.docs.map((item) => {
      let temp = item.data();
      let obj: CRUDProps = {
        title: temp.title,
        description: temp.description,
      };
      console.log(obj);

      return obj;
    });
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

  return (
    <>
      <form>
        <label>Title</label>
        <input id="title" name="title" onChange={handleTitle} />

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
    </>
  );
};

export default Blog;
