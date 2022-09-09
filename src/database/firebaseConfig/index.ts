
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc} from "firebase/firestore";
import { getAuth, UserCredential } from "firebase/auth";
import { getStorage} from "firebase/storage";
import { AddUserDataType } from "../../components/SignUp";

  // const firebaseConfig = {
  //   apiKey: "AIzaSyDWztXPDt_fIjY_n5saKRTROLN3kxik2HA",
  //   authDomain: "food-app-6978f.firebaseapp.com",
  //   databaseURL: "https://food-app-6978f-default-rtdb.firebaseio.com",
  //   projectId: "food-app-6978f",
  //   storageBucket: "food-app-6978f.appspot.com",
  //   messagingSenderId: "271724303724",
  //   appId: "1:271724303724:web:b213e48aa2e157bf804f49",
  // };
 
const firebaseConfig = {
  apiKey: "AIzaSyC8TRZbNau2aZIn-9-8BSVFBeNx7uCY6IE",
  authDomain: "food-app-78d24.firebaseapp.com",
  databaseURL: "https://food-app-78d24.firebaseio.com",
  projectId: "food-app-78d24",
  storageBucket: "food-app-78d24.appspot.com",
  messagingSenderId: "490475426385",
  appId: "1:490475426385:web:e63effd07fbc9ef1c31e70"
};
  const app = initializeApp(firebaseConfig);

  export const firebaseDatabase = getFirestore(app);
  export const auth = getAuth(app);
  export const storage = getStorage(app);

  export const createUserDocument = async (user: any, additionalData: AddUserDataType) => {
    if (!user) return;
    const userRef = doc(firebaseDatabase, "user", `${user.uid}`);
    const snapshot = await getDoc(userRef);

    if (!snapshot){
      const {email, password} = user;
      const {name, contact, isAdmin}= additionalData;
    }

    try {
      setDoc(userRef, {
      name: additionalData.name,
      contact: additionalData.contact,
      email: user.email,
      password: user.password,
      isAdmin: additionalData.isAdmin,
      })
    }catch (error){
      console.log(error);
      
    }

  }


// export {firebaseDatabase, auth, storage}

  

