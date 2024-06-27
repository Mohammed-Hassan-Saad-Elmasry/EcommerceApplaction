import nodemailer from "nodemailer";

async function sendEmail({
  to,
  cc,
  bcc,
  subject,
  html,
  attachments = [],
} = {}) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "01140775155ss@gmail.com",
      pass: "bial jsqz cfsy qhko",
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `"Mohammed elmasry company" <${process.env.gmail}>`, // sender address
    to,
    cc,
    bcc,
    subject,
    html,
    attachments,
  });
  return info.rejected.length ? false : true;
}

export default sendEmail;
