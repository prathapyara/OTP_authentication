import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../router/config.js";
import otpGenerator from "otp-generator";

export const verifyUser=async(req,res,next)=>{
    try{
        const {username}=req.method=="GET" ? req.query:req.body;
        let exist=await UserModel.findOne({username});
        if(!exist) return res.status(404).send({error:"Can't find User!"});
        next();
    }catch(error){
        return res.status(404).send({error:"Authentication Error"});
    }
}

export const register=async(req,res)=>{
    try{
        const {username,password,email,profile}=req.body;

        const existUsername=new Promise((resolve,reject)=>{
            
            UserModel.findOne({username}).then((user)=>{
                if(user){
                   
                    reject({error:"Please use the unique username"});
                }
                resolve();
            }).catch((error)=>{
                return res.send(error);
            })
        });

        const existEmail=new Promise((resolve,reject)=>{
           
            UserModel.findOne({email}).then((email)=>{
                if(email){
                    reject({error:"Please use the unique Email"});
                } 
                resolve();
            }).catch((error)=>{
                return res.send(error);
            })
        });

        Promise.all([existUsername,existEmail]).then(()=>{
            if(password){
                bcrypt.hash(password,10).then(hashedPasword=>{
                    const user=new UserModel({
                        username,
                        password:hashedPasword,
                        email,
                        profile:profile || "",
                    });
                    user.save().then((result)=>{
                        res.status(201).send({msg:"User registered sucessfully"});
                    }).catch((error)=>{
                        res.status(504).send({error});
                    });
                }).catch(error=>{
                    return res.send(503).send({
                        error:"Enable to hased password"
                    })
                })
            }
        }).catch(error=>{
            return res.status(502).send({
                error:"Email or Username are not unique",
            })
        })
    }catch(error){
        return res.status(501).send(error);
    }
    
}

export const login=async(req,res)=>{
    const {username,password}=req.body;
    try{
        UserModel.findOne({username}).then((user)=>{
            bcrypt.compare(password,user.password).then(passwordCheck=>{
                if(!passwordCheck) return res.status(400).send({error:"Don't have password"});
                const token=jwt.sign({
                    userId:user._id,
                    username:user.username,
                },ENV.JWT_SECRET,{expiresIn:"24h"});

            return res.status(200).send({
                msg:"Login Successful...!",
                username:user.username,
                token
            }); 

            }).catch((error)=>{
                return res.status(400).send({error:"Password does not Match"});
            })
            
        }).catch(error=>{
            return res.status(404).send({error:"Username not found"});
        })
    }catch(error){
        return res.status(500).send({error});
    }
}

export const getuser=async(req,res)=>{
    const {username}=req.params;
    try{
        if(!username){
            return res.status(501).send({error:"Invalid username"})
        }
        UserModel.findOne({username}).then((user)=>{
            if(!user){
                return res.status(501).send({error:"couldn't find the user"});
            }

            //to hide the password field and get the remaining data we use this method
            const {password,...rest}=Object.assign({},user.toJSON());
            return res.status(201).send(rest);
        }).catch((error)=>{
            return res.status(500).send(error);
        })

    }catch(error){
        return res.status(404).send("Cannot find the user details");
    }
}

export const updateUser=async(req,res)=>{
    try{
        const {userId}=req.user;
        if(userId){
            const body=req.body;
            UserModel.updateOne({_id:userId},body).then(()=>{
                return res.status(201).send({msg:"Record Updated...!"});
            }).catch(error=>{
                return res.status(401).send(error)
            })
        }else{
            return register.status(401).send({error:"User Not Found...!"});
        }

    }catch(error){
        return res.status(401).send(error);
    }
}

export const generateOTP=async(req,res)=>{
    req.app.locals.OTP=await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false});
    res.status(201).send({code: req.app.locals.OTP});
}

export const verifyOTP=async(req,res)=>{
    const {code}=req.query;
    if(parseInt(req.app.locals.OTP)===parseInt(code)){
        req.app.locals.OTP=null;
        req.app.locals.resetSession=true;
        return res.status(201).send({mesg:"verify Successfully"});
    }
    return res.status(404).send({error:"Invalid OTP"});
}

export const createResetSession=async(req,res)=>{
    if(req.app.locals.resetSession){
        req.app.locals.resetSession=false;
        return res.status(201).send({flag: req.app.locals.resetSession});
    }
    return res.status(440).send({error:"Session expired!"});
}

export const resetPassword=async(req,res)=>{
   try{
    const {username,password}=req.body;
    try{
        UserModel.findOne({username}).then((user)=>{
            bcrypt.hash(password,10).then(hashedPasword=>{
                UserModel.updateOne({username:user.username},{password:hashedPasword}).then(()=>{
                    res.status(201).send("Record Updated..!");
                }).catch((err)=>{
                    res.status(404).send(err);
                })
            }).catch((e)=>{
                return res.status(500).send({
                    error:'Enable to handed password'
                })
            })

        }).catch((err)=>{
            return res.status(404).send({error:"Username not found"});
        })
    }catch(err){
        res.status.send(404).send({error})
    }
   }catch(err){
    res.status(404).send(err);
   }
}



