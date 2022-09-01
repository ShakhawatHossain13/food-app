
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

type CRUDProps = {
    title: string;
    description: string;
  };

const UseFirebase = async() => {
  const firebaseConfig = {
    apiKey: "AIzaSyDWztXPDt_fIjY_n5saKRTROLN3kxik2HA",
    authDomain: "food-app-6978f.firebaseapp.com",
    databaseURL: "https://food-app-6978f-default-rtdb.firebaseio.com",
    projectId: "food-app-6978f",
    storageBucket: "food-app-6978f.appspot.com",
    messagingSenderId: "271724303724",
    appId: "1:271724303724:web:b213e48aa2e157bf804f49",
  };

  initializeApp(firebaseConfig);
  const db = getFirestore();

  //coolection ref
  const colRef = collection(db, "blog");

  // get collection data

  try{
    const result = await getDocs(colRef);

    const prepareData = result?.docs.map((item) => {
      let temp = item.data();
      let obj: CRUDProps = {      
        title: temp.title,
      description: temp.description
        }
        return obj;
      })
      return prepareData;
    }catch (error) {
  console.log(error);
}
  

}



export default UseFirebase;




  

