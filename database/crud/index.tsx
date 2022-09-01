import React from "react";
import StartFirebase from "../firebaseConfig";
import { ref, set, get, update, remove, child, Database } from "firebase/database"; 

type CRUDProps = {
    db: Database;
    userName: string,
    title: string;
    description: string;
}
const CRUD = ({ db, userName, title, description }: CRUDProps) => {
    const [post, setPost] = React.useState<CRUDProps>({
        db: "",
        userName: "",
        title: "",
        description: "",

    })

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPost((prev) => {
          return {
            ...prev,
            [name]: value,
          };
        });    
      }; 

    const handleSubmit = () => {
        const db = post.db;
        const data = {
            userName : post.userName,
            title: post.title,
            description: post.description
        }
    }
      
    React.useEffect(() => {
        setPost((prev) => ({
            ...prev,
            db: StartFirebase()
        })
        )
    }, [])

    return (
        <>
            <form>
                <input type="text" id="userName"
                    name="userName"
                    value={userName}
                    onChange={handleChange}
                />
                <input type="text" id="title"
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
                <input type="text" id="description"
                    name="description"
                    value={description}
                    onChange={handleChange}
                />
                <button id="addbtn"  type="submit" onSubmit={handleSubmit}></button>
            </form>
        </>
    )

}

export default CRUD;