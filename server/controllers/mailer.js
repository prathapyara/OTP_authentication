import nodemailer from "nodemailer";
import mailgen from "mailgen";
import config from "../router/config.js";

const transporter = nodemailer.createTransport({
    host: "smtp.forwardemail.net",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: config.ENV_EMAIL,
      pass: config.ENV_PASSWORD,
    },
  });

  var mailGenerator=new mailgen({
    theme:"default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/"
    }
  });

  export const registerMail=async(req,res)=>{
    const {username,userEmail,text,subject}=req.body;

    //body of the image
    var body={
        body:{
            name:username,
            intro: text || "welcome",
            outro:"Need Help"
        }
    }
    var emailbody=mailGenerator.generate(body);
    let message={
        from:config.ENV_EMAIL,
        to:userEmail,
        subject:subject|| "Sign in",
        html:emailbody
    }

    transporter.sendMail(message).then(()=>{
        return res.status(200).send({msg:"You should receive an email from us"})
    }).catch((err)=>{
        res.status(404).send(err);
    })
    }
  