import React, { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import toast ,{Toaster} from "react-hot-toast";
import {useFormik} from "formik";
import { registerValidate } from "../helper/validate.js";
import convertToBase64 from "../helper/convert.js";
import { registerUser } from "../helper/helper.js";


export default function Register(){
  const navigate=useNavigate();
    const [file,setFile]=useState(avatar)
    const formik=useFormik({
       initialValues:{
          email:"",
          username:"",
          password:"",
       },
       validate:registerValidate,
       validateOnBlur:false,
       validateOnChange:false,
       onSubmit:async(values)=>{
        values=await Object.assign(values,{profile:file|| ""});
        const credentials=values;
        let registerPromise=registerUser(credentials);
        console.log(registerPromise);
        toast.promise(registerPromise,{
          loading:"Created...",
          success:<b>Register Successfully...!</b>,
          error:<b>Could not register</b>
        });
        registerPromise.then(function(){navigate("/")});
       }
    });

    const onUpload=async(e)=>{
        const base64=await convertToBase64(e.target.files[0]);
        setFile(base64);
    }
 
 
     return (
         <div className="container mx-auto">
         <Toaster position="top-center" reverseOrder={false}></Toaster>
             <div className="flex justify-center items-center h-screen">
              <div className={styles.glass} style={{width:"45%"}}>
                <div className="title flex flex-col items-center">
                  <h4 className="text-5xl font-bold">Register</h4>
                  <span className="py-4 text-xl w-2/3 text-center text-gray-500" >
                     Happy to join you!
                  </span>
                </div>
 
                <form className="py-1" onSubmit={formik.handleSubmit}>
                  <div className="profile flex justify-center py-3">
                    <label htmlFor="profile">
                      <img className={styles.profile_img} src={file} alt="avatar" />
                    </label>
                    <input onChange={onUpload} type="file" id="profile" name="profile" />
                  </div>
                  <div className="textbox flex flex-col items-center gap-1.5">
                     <input {...formik.getFieldProps("email")} className={styles.textbox} type="text" placeholder="Email" />
                     <input {...formik.getFieldProps("username")} className={styles.textbox} type="text" placeholder="Username" />
                     <input {...formik.getFieldProps("password")} className={styles.textbox} type="text" placeholder="Password" />
                     <button className={styles.btn} type="submit" >Register</button>
                  </div>
 
                  <div className="text-center py-4">
                     <span className="text-gray-500">Already Register?<Link className="text-red-500" to="/"> Login Now</Link></span>
                  </div>
 
                </form>
              </div>
             </div>
         </div>
     )
 }