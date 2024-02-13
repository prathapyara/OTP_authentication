import React from "react";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import { Link,useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate.js";
import toast,{ Toaster } from "react-hot-toast";
import { useAuthStore } from "../store/store.js";
import useFetch from "../hooks/fetch.hook.js";
import { verfiyPassword } from "../helper/helper.js";

export default function Password(){
  const navigate=useNavigate();
  const username=useAuthStore(state=>state.auth.username);
  
  const [{isLoading,apiData,serverError}]=useFetch(`user/${username}`);
  
  const formik=useFormik({
        initialValues:{
            password:"",
            username:username,
        },
        validate:passwordValidate,
        validateOnBlur:false,
        validateOnChange:false,
        onSubmit:async(values)=>{  
          let loginPromise=verfiyPassword({username,password:values.password});
          
          toast.promise(loginPromise,{
            loading:"checking",
            success:<b>Login success</b>,
            error:<b>login falied</b>
          });
          loginPromise.then(res=>{
            let{token}=res.data;
            localStorage.setItem("token",token);
            navigate("/profile");
          });
        }
    })

    if(isLoading)return <h1 className="text-2xl font-bold">isLoading</h1>;
    if(serverError) return <h1 className="text-xl text-red-500">{serverError.message}</h1>

    return (
      <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
        <div className="flex flex-col justify-center items-center h-screen">
          <div className={styles.glass}>

          <div className="title flex flex-col items-center">
             <h4 className="text-5xl font-bold">Hello {apiData?.firstName|| apiData?.username}</h4>
             <span className="py-4 text-xl w-2/3 text-center text-gray-500">Explore More by connecting with us.</span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-4">
                <img className={styles.profile_img} src={apiData?.profile || avatar} alt="avatar" />
              </div>
              <div className="flex flex-col items-center gap-6">
                <input {...formik.getFieldProps("password")} className={styles.textbox} type="password" placeholder="Password"></input>
                <button className={styles.btn} type="submit">Sign In</button>
              </div>
          </form>

          <div className="text-center py-4">
            <span className="text-gray-500">Forgot Password? <Link className="text-red-500" to="/recovery">Recovery</Link></span>
          </div>
            
          </div>
        </div>
        </div>
    )
}