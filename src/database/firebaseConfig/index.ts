
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage} from "firebase/storage";

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

  const firebaseDatabase = getFirestore(app);
  const auth = getAuth(app);
  const storage = getStorage(app);

export {firebaseDatabase, auth, storage}

  

