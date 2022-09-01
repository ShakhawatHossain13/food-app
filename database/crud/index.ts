import React from "react";
import StartFirebase from "../firebaseConfig";
import {ref, set, get, update, remove, child, Database} from "firebase/database";

type CRUDProps = {
    db: Database;
    title: string;
    description: string;
}
const CRUD = ({db, title, description}:CRUDProps) => {
    const [post, setPost] = React.useState({})


React.useEffect(()=>{
    setPost((prev)=>({
        ...prev,
        db: StartFirebase()
    })
)
},[])


}

export default CRUD;