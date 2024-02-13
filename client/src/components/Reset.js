import React from "react";
import { Link } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import toast,{Toaster} from "react-hot-toast";
import {useFormik} from "formik";
import { resetPasswordValidate } from "../helper/validate.js";
import { resetPassword } from "../helper/helper.js";
import { useAuthStore } from "../store/store";
import { useNavigate,Navigate } from "react-router-dom";
import useFetch from "../hooks/fetch.hook.js";

export default function Username(){

   const {username}=useAuthStore(state=>state.auth);
   const navigate=useNavigate();
   const [{isLoading,apiData,status,serverError}]=useFetch(`createResetSession`);

   const formik=useFormik({
      initialValues:{
         password:"",
         confirm_pwd:"",
      },
      validate:resetPasswordValidate,
      validateOnBlur:false,
      validateOnChange:false,
      onSubmit:async(values)=>{
        let resetPromise=resetPassword({username,password:values.password});
        console.log(resetPromise);
        toast.promise(resetPromise,{
         loading:"updating...",
         success:<b>Update Successfully...!</b>,
         error:<b>Could not Update!</b>
       });
        resetPromise.then(()=>{
         navigate("/password");
        })

      }
   });

   if(isLoading)return <h1 className="text-2xl font-bold">isLoading</h1>;
   if(serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>
   if(status && status!==201)return <Navigate to={"/password"} replace={true}></Navigate>


    return (
        <div className="container mx-auto">
        <Toaster position="top-center" reverseOrder={false}></Toaster>
            <div className="flex justify-center items-center h-screen">
             <div className={styles.glass} style={{width:"40%"}}>
               <div className="title flex flex-col items-center">
                 <h4 className="text-5xl font-bold">Reset</h4>
                 <span className="py-1 text-sm w-2/3 text-center text-gray-500" >
                    Enter the new password
                 </span>
               </div>

               <form className="py-10" onSubmit={formik.handleSubmit}>
                 <div className="flex flex-col items-center gap-2">
                    <input {...formik.getFieldProps("password")} className={styles.textbox} type="text" placeholder="New Password" />
                    <input {...formik.getFieldProps("confirm_pwd")} className={styles.textbox} type="text" placeholder="Repeat Password" />
                    <button className={styles.btn} type="submit" >Rest</button>
                 </div>
               </form>
             </div>
            </div>
        </div>
    )
}