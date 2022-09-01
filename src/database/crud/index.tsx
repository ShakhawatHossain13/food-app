import React from "react";
import {
  collection,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebaseDatabase } from "../firebaseConfig";

type CRUDProps = {
  title: string;
  description: string;
};

export const CRUD = async () => {
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
    return prepareData;
  } catch (error) {
    console.log(error);
  }
};
