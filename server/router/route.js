import { Router } from "express";
import * as controller from "../controllers/appController.js";
import Auth from "../middleware/auth.js";
import { localVariables } from "../middleware/auth.js";
import { registerMail } from "../controllers/mailer.js";
const router=Router();

//POST Methods:
router.post("/register",controller.register);
router.post("/registerMail",registerMail);
router.post("/authenticate",controller.verifyUser,(req,res)=>{
    res.end();
});
router.post("/login",controller.verifyUser,controller.login);

//GET Methods:
router.get("/user/:username",controller.getuser);
router.get("/generateOTP",controller.verifyUser,localVariables,controller.generateOTP);
router.get("/verifyOTP",controller.verifyUser,controller.verifyOTP);
router.get("/createResetSession",controller.createResetSession);

//PUT Methods:
router.put("/updateuser",Auth,controller.updateUser);
router.put("/resetPassword",controller.verifyUser,controller.resetPassword);

export default router;