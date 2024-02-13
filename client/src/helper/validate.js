import toast from "react-hot-toast";
import { authenticate,verfiyPassword, verifyOTP } from "./helper.js";


export const usernameValidate=async (values)=>{
    const errors=usernameVerify({},values);
    if(values.username){
      const {status}=await authenticate(values.username);
      console.log(status);
      if(status!==200){
        errors.exist=toast.error("User does not exist");
      }
    }
    return errors;
};

export const passwordValidate=async (values)=>{
  const errors=passwordVerify({},values);
  return errors;
}

export const resetPasswordValidate=async (values)=>{
 
  const errors=resetPasswordVerify({},values);
  return errors;
}

export const registerValidate=async(values)=>{
  const errors=usernameVerify({},values);
  passwordVerify(errors,values);
  emailVerify(errors,values);
  
  return errors; 
}

export const profileValidate=async(values)=>{
  const errors=emailVerify({},values);
  return errors;
}

function usernameVerify(error={},values){
    if(!values.username){
      error.username=toast.error("Need the username..!");
    }else if(values.username.includes(" ")){
      error.username=toast.error("Invalid username...!");
    }
    return error;
}

function passwordVerify(error={},values){
  let length=values.password.length;
  const specialChars= /[!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/;
  if(!values.password){
    error.password=toast.error("Password needed..!");
  }else if(values.password.includes(" ")){
    error.password=toast.error("Password should not be empty");
  }else if(length<4){
    error.password=toast.error("Length of the password should be minimum of 4 chartercter length");
  }else if(!specialChars.test(values.password)){
    error.password=toast.error("Password must have the special character");
  }
  return error;
}

function resetPasswordVerify(error={},values){
  let length=values.password.length;
  const specialChars= /[!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/;
  if(values.password.includes(" ") || values.confirm_pwd.includes(" ")){
    error.password=toast.error("Enter password....!");
  }else if(values.password!==values.confirm_pwd){
    error.password=toast.error("password is miss match");
  }else if(length<4){
    error.password=toast.error("Length of the password should be minimum of 4 chartercter length");
  }else if(!specialChars.test(values.password)){
    error.password=toast.error("Password must have the special character");
  }
    return error;
}


function emailVerify(error={},values){
  if(!values.email){
    error.email=toast.error("Email is needed...!");
  }else if (values.email.includes(" ")){
    error.email=toast.error("Email should not be empty...!");
  }else if(!values.email.includes("@")){
    error.email=toast.error("This is not the right formate");
  }
  return error;
}
