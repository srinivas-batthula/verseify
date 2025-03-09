const mongoose = require("mongoose")


const blogSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'verseify_users',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        maxlength: 400
    },
    tags: [{
        type: String
    }],
    likes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'verseify_users'
    }],
    media: {
        secure_url: {
            type: String
        },
        public_id: {
            type: String
        }
    }
}, { timestamps: true })


const blogModel = mongoose.model('verseify_blogs', blogSchema)


module.exports = blogModel
