const jwt = require('jsonwebtoken')
const userModel = require('../models/User')
require('dotenv').config({ path: './config.env' })
const Email = require('../services/email')
const { redisPost, redisGet } = require('../services/redisDb')


const JWT_SECRET = process.env.JWT_SECRET + ''
const MODE = process.env.MODE + ''

// Using this Authorization_Middleware in protected routes...

const Authorization_Middleware = async (req, res, next) => {
    const token = req.cookies.jwt || req.headers.Authorization || ''
    // console.log(req.cookies.jwt+'    '+req.headers.Authorization)
    
    if (token === '') {               //Checking Token availability...
        return res.status(401).json({ 'success': false, 'Auth': false, 'details': "Cookies/Token Not Found!" })
    }
    // console.log(req.cookies)
    try {
        const decode = await jwt.verify(token, JWT_SECRET)       //Verifying JWT Token...
        if (decode) {
            let user =  {}

            // r = await redisGet(decode.user_id)                 //Search for user in REDIS DB...
            // if(r.success === false) {
                user = await userModel.findById(decode.user_id).select('-password').lean()      //Checking if user existed in DB...
                if (!user) {
                    return res.status(408).json({ 'success': false, 'Auth': false, 'details': "User Not Found in our DB!" })
                }

                // await redisPost(decode.user_id, decode.passwordModifiedAt)                  //Adding new values to REDIS DB...
            // }
            // else {
            //     console.log("Redis authorisation...")
            //     user = r.user
            // }
            
            if (new Date(decode.validFor).getTime() !== new Date(user.passwordModifiedAt).getTime()) {
                return res.status(423).json({ 'success': false, 'Auth': false, 'details': "Details Not Matched! Please Login again." });
            }
            
            req.user = {                //Assigning user's details to req-obj for future use...
                'userId': user._id,
                // 'username': user.username,
                // 'email': user.email,
                // 'subscription': user.subscription || false
            };
            // console.log("Authorized")       //Passing to next middleware (endPoint).
            next()
        }
        else {
            return res.status(403).json({ 'success': false, 'Auth': false, 'details': "Invalid Token!" });
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ 'success': false, 'Auth': false, 'details': "Error while Verifying Token!" });
    }
}

const forgotPasswordEmail = async(req, res, next)=>{
    // const home_url = req.query.home_url||'http://localhost:3000/'
    const { email } = req.body

    if(!email){
        return res.status(400).json({'success': false, 'details':'Invalid inputs!'})
    }

    const otp = (Math.floor(1000 + Math.random() * 9000))+''
    const payload = {
        email,
        otp
    }
    const token = jwt.sign(payload, JWT_SECRET, {expiresIn:'5m'})
    let name=''
    try{
        const r = await userModel.findOneAndUpdate({email}, {otp})
        name = r.username
    }
    catch(err){
        // console.log(err)
        return res.status(500).json({'success': false, 'details':'Email Not Matched with our Data!'})
    }

    const body = {
        email,
        subject:'Forgot Password request!',
        htmlText:`<html><body>
                <h1>Hello ${name || 'user'},,</h1>
                <h2>Your Password Reset request has been approved!</h2>
                <h3>click below link & Follow the instructions to reset your forgotten password.</h3>
                <br>
                <a href="http://localhost:8080/api/auth/forgot-password/${token}" styel="width:150px; height:90px; font-size:30px;">Click Here</a>
                <br>
                <h3>~Thanks  from feedback team.</h3>
                <h3 style="color: skyblue;">~Verseify</h3>
                </body></html>`
    }
    try {               //Sending Email with Token...
        const r = await Email.email(body)
        if(r.success){
            return res.status(201).json({'success': true, 'details':'Email sent with Verification Code.'})
        }
    }
    catch (err) {
        // console.log(err)
        return res.status(501).json({'success': false, 'details':'Unable to send email!'})
    }
    return res.status(500).json({'success': false, 'details':'Unable to send email!'})
}

const forgotPassword = async (req, res)=>{
    const token = req.params.tokenId
    const id = token
    const {check} = req.body

    //Forgot Password
    if(check==='true'){
        const {newPassword} = req.body
    
        // console.log(token, newPassword)
    
        if(token && newPassword){
            try{
                const decoded = await jwt.verify(token, JWT_SECRET)
            
                const r = await userModel.findOne({email: decoded.email})
                if(r){
                    if(r.otp === decoded.otp){
                        r.password = newPassword
                        r.otp = undefined
                        const resp = await r.save()

                        // const re = await userModel.findById(r._id)
                        // const resp2 = await redisPost(re._id, re.passwordModifiedAt)

                        if(resp){       //final
                            return res.status(200).json({success: true, details: 'Password Updated Successfully!'})
                        }
                        else{
                            return res.status(500).json({success: false, details: 'Something went Wrong!'})
                        }
                    }
                    else{
                        return res.status(423).json({success: false, details: 'OTP Not Matched!'})
                    }
                }
                else{
                    return res.status(500).json({success: false, details: 'Something went Wrong!'})
                }
            }
            catch(err){
                return res.status(500).json({success: false, details: 'Something went Wrong!', err})
            }
        }
        else{
            return res.status(423).json({success: false, details: 'Invalid Credentials!'})
        }
    }

    //Reset Password
    else{
        const {newPassword, oldPassword} = req.body

        if(newPassword && oldPassword){            //Check Old-Password & update a New one...
            try {
                const r = await userModel.findById(id)
                if(!(await r.comparePassword(oldPassword))){
                    return res.status(403).json({'success': false, 'details':'Old Password Not matched!'})
                }

                r.password = newPassword
                const resp = await r.save()

                // const re = await userModel.findById(r._id)
                // const resp2 = await redisPost(re._id, re.passwordModifiedAt)

                if(resp) {
                    return  res.status(200).json({'success': true, 'details':'Password Changed.'})
                }
                else{
                    return res.status(500).json({success: false, details: 'Something went Wrong!'})
                }
            }
            catch(err) {
                // console.log(err)
                return res.status(500).json({'success': false, 'details':'Unable to modify Password!', err})
            }
        }
        else{
            return res.status(400).json({'success': false, 'details':'Invalid inputs!'})
        }
    }
}

const signUp = async (req, res) => {
    const body = req.body

    if (body.username === '' || body.email === '' || body.password === '') {
        return res.status(400).json({ 'success': false, 'details': 'Invalid Details!' })
    }

    try {                               //Checking if user already exists in db...
        const response = await userModel.findOne({ email: body.email }).lean()
        if (response) {
            return res.status(400).json({ 'success': false, 'details': 'User already exists in our DB! Please do SignIn.' })
        }
    }
    catch (error) {
        // console.log(error)
        return res.status(500).json({ 'success': false, 'details': 'Failed to Retrieve data!' })
    }

    try {                               //Creating New User in DB...
        const response = await userModel.create(body)
        if (!response) {
            return res.status(501).json({ 'success': false, 'details': 'Failed to Create New User! Please try again.' })
        }
        //Token Generation...
        try {
            let token_body = {
                user_id: response._id,
                validFor: response.passwordModifiedAt,
            }
            // const token = await jwt.sign(token_body, JWT_SECRET, { expiresIn: '7d' })
            const token = await new Promise((resolve, reject) => {
                jwt.sign(token_body, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
                    if (err) reject(err)
                    resolve(token)
                })
            })
            if (!token) {
                return res.status(501).json({ 'success': false, 'details': 'Token Creation Failed!' })
            }
            try{                                                   //final...
                // const resp2 = await redisPost(token_body.user_id, token_body.validFor)
                // if(resp2.success === false) { 
                //     return res.status(500).json({'success': false, 'details': 'An error encountered in REDIS DB!'})
                // }

                res.cookie('jwt', token, { path: '/api', httpOnly: true, secure: (MODE === 'production'), sameSite: (MODE === 'production') ? 'None' : 'Lax', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
                return res.status(201).json({ 'success': true, 'details': 'New User created successfully!' })
            }
            catch(err){
                return res.status(201).json({ 'success': true, 'details': 'New User created successfully!', token })
            }
        }
        catch (error) {
            // console.log(error)
            return res.status(500).json({ 'success': false, 'details': 'Token Creation Failed!' })
        }
    }
    catch (error) {
        // console.log(error)
        return res.status(500).json({ 'success': false, 'details': 'Failed to Create New User! Please try again.' })
    }
}


const signIn = async (req, res) => {
    const body = req.body
    if (body.email === '' || body.password === '') {
        return res.status(400).json({ 'success': false, 'details': 'Invalid Details!' })
    }

    try {                               //Checking if user exists in db...
        const response = await userModel.findOne({ email: body.email })
        // console.log(response)
        if (!response) {
            return res.status(400).json({ 'success': false, 'details': 'User Not Found in our DB! Please do SignUp first.' })
        }

        if (!(response.comparePassword(body.password))) {            //Comparing Passwords...
            return res.status(401).json({ 'success': false, 'details': 'Password Not Matched!' })
        }
                                        //Token Generation...
        try {
            let token_body = {
                user_id: response._id,
                validFor: response.passwordModifiedAt,
            }
            const token = await new Promise((resolve, reject) => {
                jwt.sign(token_body, JWT_SECRET, { expiresIn: '7d' }, (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                })
            })
            if (!token) {
                return res.status(501).json({ 'success': false, 'details': 'Token Creation Failed!' })
            }
            try{                                            //final...
                // const resp2 = await redisPost(token_body.user_id, token_body.validFor)
                // if(resp2.success === false) { 
                //     return res.status(500).json({'success': false, 'details': 'An error encountered in REDIS DB!'})
                // }

                res.cookie('jwt', token, { path: '/api', httpOnly: true, secure: (MODE === 'production'), sameSite: (MODE === 'production') ? 'None' : 'Lax', expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) })
                return res.status(201).json({ 'success': true, 'details': 'User verified successfully!', token })
            }
            catch(err){
                return res.status(201).json({ 'success': true, 'details': 'User verified successfully!', token })
            }
        }
        catch (error) {
            // console.log(error)
            return res.status(500).json({ 'success': false, 'details': 'Token Creation Failed!' })
        }
    }
    catch (error) {
        // console.log(error)
        return res.status(500).json({ 'success': false, 'details': 'Failed to Retrieve data!' })
    }
}

const signOut = async (req, res) => {
    try {                            //Clearing JWT token (cookie)...
        res.clearCookie('jwt', { path: '/api', secure: (MODE === 'production'), sameSite: (MODE === 'production') ? 'None' : 'Lax', httpOnly: true })
        return res.status(200).json({ 'success': true, 'details': "Cookie Cleared, Login again." })
    }
    catch (err) {
        return res.status(500).json({ 'success': false, 'details': "No Cookie Found, Login again.", 'error': err })
    }
}



module.exports = { signUp, signIn, signOut, Authorization_Middleware, forgotPassword, forgotPasswordEmail }
