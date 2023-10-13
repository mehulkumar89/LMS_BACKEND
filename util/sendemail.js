import nodemailer from "nodemailer"
const sendEmail = async function(email,subject,message){
  let account=nodemailer.createTestAccount()
  const smtpConfig = {
    host: process.env.SMP_HOST,
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMP_USER,
        pass: process.env.SMP_PASS
    }
};
let transporter = nodemailer.createTransport(smtpConfig);
        await transporter.sendMail({
        from: process.env.SMP_USER,
        to: email,
        subject: subject,
        html: message,
      });
};

export default sendEmail