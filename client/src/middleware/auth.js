import { Navigate } from "react-router-dom";
import Profile from "../components/Profile.js";
import { useAuthStore } from "../store/store.js";

export const AuthoriseUser=({children})=>{
    const token=localStorage.getItem("token");
    console.log(token);
    if(!token){
        return <Navigate to={"/"} replace={true}></Navigate>
    }
    return children;
}

export const ProtectRoute=({children})=>{
    const username=useAuthStore.getState().auth.username;
    if(!username){
        return <Navigate to={"/"} replace={true}></Navigate>
    }
    return children;
}