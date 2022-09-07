
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
 
  const firebaseConfig = {
    apiKey: "AIzaSyDWztXPDt_fIjY_n5saKRTROLN3kxik2HA",
    authDomain: "food-app-6978f.firebaseapp.com",
    databaseURL: "https://food-app-6978f-default-rtdb.firebaseio.com",
    projectId: "food-app-6978f",
    storageBucket: "food-app-6978f.appspot.com",
    messagingSenderId: "271724303724",
    appId: "1:271724303724:web:b213e48aa2e157bf804f49",
  };

  const app = initializeApp(firebaseConfig);
export const firebaseDatabase = getFirestore(app);



  

