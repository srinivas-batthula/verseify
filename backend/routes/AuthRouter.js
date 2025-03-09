const router = require("express").Router();
require("dotenv").config({ path: "../config.env" });
const jwt = require('jsonwebtoken')
const passport = require("passport")
const crypto = require("crypto")
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const AuthController = require("../controllers/AuthController");
const userModel = require('../models/User')



const JWT_SECRET = process.env.JWT_SECRET + ''
const MODE = process.env.MODE + ''


router.post("/signUp", AuthController.signUp);
router.post("/signIn", AuthController.signIn);
router.get("/signOut", AuthController.signOut);

router.get("/googleAuth", (req, res) => {
    return res.redirect("/api/auth/google")
});

router.post("/forgot-password-email", AuthController.forgotPasswordEmail);
router.post("/forgot-password/:tokenId", AuthController.forgotPassword);
router.get("/forgot-password/:token", async(req, res)=>{
    const nonce = crypto.randomBytes(16).toString("base64");
    res.setHeader("Content-Security-Policy", `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net`);

    const token = req.params.token
    try {
        await jwt.verify(token, JWT_SECRET)
        return res.status(200).render('reset', {token, nonce, check: true})
    }
    catch(error) {
        return res.status(401).render('reset', {message: 'Invalid Token / Something went Wrong!', nonce})
    }
});

router.get("/reset-password/:id", AuthController.Authorization_Middleware, async(req, res)=>{
    const nonce = crypto.randomBytes(16).toString("base64");
    res.setHeader("Content-Security-Policy", `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net`);

    const id = req.params.id
    try {
        return res.status(200).render('reset', {id, nonce, check: false})
    }
    catch(error) {
        return res.status(401).render('reset', {message: 'Invalid Id / Something went Wrong!', nonce})
    }
});

//For OAuth2.0, add this line 'app.use(passport.initialize())' in 'app.js' to Initialize OAuth...
//To use OAuth, Redirect directly from Frontend as "window.href = '__backend-OAuth-url__'", As backend handles whole OAuth...

let user = {};
// Use Google OAuth strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_1 + "",
            clientSecret: process.env.GOOGLE_CLIENT_2 + "",
            callbackURL:
                process.env.MODE === "production"
                    ? "__hosted_url__/api/auth/google/callback"
                    : "/api/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const data = {
                    //accessed from Google...
                    username: profile.displayName,
                    email: profile.emails[0].value,
                    password: "google",
                };
                // Check if the user exists in the database...
                let response;
                response = await userModel.findOne({ email: data.email }).lean();
                if (!response) {
                    //User Not Found,, Create New User...
                    response = await userModel.create(data);
                }
                user = response;

                // Return the user data to the passport callback
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// Google Authentication Routes (Starter Path)
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
);

router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: "/api/auth/google/failure",
    }),
    async (req, res) => {
        // console.log("success")
        try {
            //Token Generation...
            let token_body = {
                user_id: user._id,
                validFor: user.passwordModifiedAt,
            };
            const token = await jwt.sign(token_body, JWT_SECRET, { expiresIn: "7d" });
            if (!token) {
                // res.status(501).json({ status: "failed", details: "Token Creation Failed!" });
                return res.status(501).redirect(process.env.HOME+'/login')
            }
            res.cookie("jwt", token, {
                path: "/api",
                httpOnly: true,
                secure: (MODE === 'production'),
                sameSite: (MODE === 'production') ? 'None' : 'Lax',
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            // res.status(201).json({success: true, 'status':'success', 'details':'User Logged-In successfully!'})
            return res.status(201).redirect(process.env.HOME+'/') //Redirecting User to Home-Page...
        } catch (error) {
            // console.log(error)
            // res.status(500).json({ status: "failed", details: "Token Creation Failed!" })
            return res.status(500).redirect(process.env.HOME+'/login')
        }
    }
);

router.get("/google/failure", (req, res) => {
    // console.log("failed")
    // res.status(403).redirect("home_url" + "/login"); //Return to Login-Page...
    // res.status(500).json({success: false, 'status': 'Un-Authorized', 'details': 'Please SignIn to continue...'})
    return res.status(500).redirect(process.env.HOME+'/login')
});


module.exports = router;
