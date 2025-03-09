require('dotenv').config({path:'./config.env'})
const nodeMailer = require('nodemailer')


const EMAIL_USER = process.env.EMAIL_USER+''                                          
const EMAIL_PASS = process.env.EMAIL_PASS+''     

const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER, // Sender's email
        pass: EMAIL_PASS, // Sender's email password or App password
    }
})


const email = async (body)=>{
    const mailOptions = {
        from: EMAIL_USER,
        to: body.email,
        subject: body.subject,
        html: body.htmlText,
    }
    try {
        await transporter.sendMail(mailOptions)
        return {'success': true, 'details':'Email Sent successfully.'}
    }
    catch (err){
        // console.log(err)
        return {'success': false, 'details':'Failed to send Email!'}
    }
}


module.exports = {email}
