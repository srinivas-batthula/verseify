const mongoose = require("mongoose")


const CommentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'verseify_users',
        required: true
    },
    blogId: {
        type: mongoose.Schema.ObjectId,
        ref: 'verseify_blogs',
        required: true
    },
    text: {
        type: String,
    },
    likesCount: {
        type: Number,
        default: 0
    },
    parentId: {
        type: mongoose.Schema.ObjectId,
        ref: 'verseify_comments',
        default: null
    }
}, { timestamps: true })


const CommentModal = mongoose.model('verseify_comments', CommentSchema)


module.exports = CommentModal
