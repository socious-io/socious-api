import save from "./save.js";
import config from "../../config.js";
import nodeMailer from "nodemailer";


const smtp = nodeMailer.createTransport(config.mail_smtp);

console.log(config.mail_smtp)

export const sendMail = async(info) => {
  
  // load default config sender from 
  if (!info.from) info.from = `"${config.mail_smtp.from_name}" <${config.mail_smtp.from}>`
  
  const result = await smtp.sendMail(info)

  // await save(result.messageId, config.mail_smtp, result)

  console.log(result)
}


sendMail({to: 'me@e-mahmoudi.me', subject: 'Hello', text: 'this is test'}).catch(err => console.log(err, '--------'))
