const mongoose = require("mongoose")
const bcrypt = require('bcryptjs')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,  // Normalize to lowercase
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String
    },
    subscription: {
        endpoint: {
            type: String
        },
        keys: {
            p256dh: {
                type: String
            },
            auth: {
                type: String
            }
        }
    },
    passwordModifiedAt: {
        type: Date,
        default: new Date()
    },
    following: [{
        type: mongoose.Schema.ObjectId,
        ref: 'verseify_users'
    }],
    bio: {
        type: String,
    },
    profile_pic: {
        secure_url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    social_links: {
        twitter: {
            type: String
        },
        instagram: {
            type: String
        },
        linkedin: {
            type: String
        },
        github: {
            type: String
        },
    }
}, { timestamps: true })


userSchema.pre('save', async function (next) {
    if (!(this.isModified('password'))) {
        return next()
    }
    try {
        const saltRounds = 13
        this.password = await bcrypt.hash(this.password, saltRounds)
        this.passwordModifiedAt = new Date()
        next()
    }
    catch (error) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model('verseify_users', userSchema)


module.exports = userModel
