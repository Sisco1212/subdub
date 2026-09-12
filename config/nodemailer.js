import nodemailer from "nodemailer";
import { EMAIL_PASSWORD } from "./env.js";


export const accountEmail = "sitopatrick2004@gmail.com"

 const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: accountEmail,
        pass: EMAIL_PASSWORD
    }
    
})
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP verification failed:", error);
    } else {
        console.log("SMTP server is ready to send emails");
    }
});

console.log("Email:", accountEmail);
console.log("Password exists:", !!EMAIL_PASSWORD);
console.log("Password length:", EMAIL_PASSWORD?.length);
console.log("Password:", EMAIL_PASSWORD ? "********" : "MISSING");

export default transporter