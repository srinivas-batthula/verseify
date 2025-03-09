const userModel = require('../models/User')
const blogModal = require('../models/Blog')
const CommentModal = require('../models/Comment')
const cloudinary = require("../cloudinaryConfig")
const mongoose = require("mongoose")
const customError = require('../utils/customError')
const CustomError = require('../utils/customError')


const getUser = async (req, res) => {
    const r = await userModel.findById(req.user.userId).select('-password').lean()
    if (!r) {
        throw new customError(500, { 'success': false, 'details': 'Unable to fetch User!' })
    }
    return res.status(200).json({ 'success': true, 'details': 'Successfully Fetched User!', 'user': r })
}

const get = async (req, res) => {
    const id = req.params.id

    const r = await userModel.findById(id).select('-password').lean()
    if (!r) {
        throw new customError(500, { 'success': false, 'details': 'Unable to fetch User!' })
    }
    return res.status(200).json({ 'success': true, 'details': 'Successfully Fetched User!', 'user': r })
}


const regexImage = /\.(jpg|jpeg|png|webp|svg|gif)$/i
const regexVideo = /\.(mp4|webm|avi|mov)$/i
const regexAudio = /\.(mp3|wav|aac|ogg)$/i
const regexPdf = /\.pdf$/i

const update = async (req, res) => {
    const check = req.query.q || 'false'           //For 'File-Upload' check = true and otherwise it is false...
    const id = req.params.id
    const body = JSON.parse(req.body.data)

    if (check === 'true') {
        // Extract file extension
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase()

        // Set resource_type and format based on the file extension
        let resource_type1 = "auto"

        // Determine resource type and format
        if (regexImage.test(fileExtension)) {
            resource_type1 = "image";
        } else if (regexVideo.test(fileExtension)) {
            resource_type1 = "video";
        } else if (regexAudio.test(fileExtension)) {
            resource_type1 = "video";
        } else if (regexPdf.test(fileExtension)) {
            resource_type1 = "raw";  // Raw files like PDFs
        }

        try {                                           //  Files are stored in cloudinary...
            const result = cloudinary.uploader.upload_stream(
                {
                    resource_type: resource_type1,
                    format: fileExtension + '' || "auto",
                    context: { _id: id, type: 'user' }       // To identify file belongs to which doc in db...
                },

                async (error, result) => {
                    if (error) {
                        return res.status(503).json({ success: false, error: error, message: "Failed to upload file!" })
                    }
                    // console.log(result)

                    body.profile_pic = {
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    }
                    try {
                        const r = await userModel.findByIdAndUpdate(id, body, { new: true }).lean()
                        if (!r) {
                            throw new customError(500, { 'success': false, 'details': 'Unable to update User!' })
                        }
                        return res.status(200).json({ 'success': true, 'details': 'Successfully Updated User!', 'user': r })
                        // return res.json({ success: true,  message: 'File Uploaded Successfully!', filePath: t.secure_url, public_id: t.public_id});
                    }
                    catch(err) {
                        return res.status(500).json({ success: false, error: err, details: "Something went Wrong!" })
                    }
                }
            ).end(req.file.buffer)
        }
        catch (err) {
            return res.status(500).json({ success: false, error: 'File Upload Failed!', details: "Something went Wrong!" })
        }
    }
    else{
        try {
            const r = await userModel.findByIdAndUpdate(id, body, { new: true }).lean()
            if (!r) {
                throw new customError(500, { 'success': false, 'details': 'Unable to update User!' })
            }
            return res.status(200).json({ 'success': true, 'details': 'Successfully Updated User!', 'user': r })
        }
        catch (err) {
            return res.status(500).json({ success: false, error: err, details: "User Update Failed!" })
        }
    }
}

const remove = async (req, res) => {
    const id = req.params.id

    const r = await userModel.findByIdAndDelete(id)
    if (!r) {
        throw new customError(500, { 'success': false, 'details': 'Unable to delete User!' })
    }
    return res.status(200).json({ 'success': true, 'details': 'Successfully Deleted User!', 'user': r })
}


const followUpdate = async (req, res) => {
    const id = req.params.id
    const body = req.body
    const q = req.query.q || 'follow'               //Follow / UnFollow

    // Check if body.id is a valid ObjectId
    if (!mongoose.isValidObjectId(body.id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID!" });
    }
    // const bodyIdObject = new mongoose.Types.ObjectId(body.id) // Convert `body.id` to ObjectId

    if(q==='follow'){
        try{
            const r = await userModel.findById(id)
            if(!r.following.includes(body.id)){
                r.following.push(body.id)
                await r.save()
            }
            // console.log('follow')
            return res.status(200).json({ 'success': true, 'details': 'Follow Update Successful!', 'user':r })
        }
        catch(err){
            return res.status(500).json({ success: false, error: err, message: "Follow Update Failed!" })
        }
    }
    else{
        try{
            const r = await userModel.findById(id)
            if(r.following.includes(body.id)){
                const updated = r.following.filter(item => !item.equals(body.id))
                r.following = updated
                await r.save()
            }
            return res.status(200).json({ 'success': true, 'details': 'UnFollow Update Successful!', 'user':r })
        }
        catch(err){
            console.log(err)
            return res.status(500).json({ success: false, error: err, message: "UnFollow Update Failed!" })
        }
    }
}

const follow = async (req, res) =>{
    const {id} = req.params
    const q = req.query.q || 'following'                       //q = 'followers' / 'following'
    // console.log(id)
    
    // Validate id
    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({ success: false, message: "Invalid user ID!" });
    }

    if(q==='following'){
        try {
            const result = await userModel.aggregate([
                // 1️⃣ Match the user by id
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
    
                // 2️⃣ Lookup details of users in 'following' array
                {
                    $lookup: {
                        from: "verseify_users", // Collection name
                        localField: "following",
                        foreignField: "_id",
                        as: "followingUsers"
                    }
                },
    
                // 3️⃣ Project only required fields
                {
                    $project: {
                        _id: 0,
                        followingUsers: {
                            _id: 1,
                            username: 1,
                            bio: 1,
                            profile_pic: 1
                        }
                    }
                }
            ]);
    
            // If user doesn't exist or has no following users
            if (!result.length || !result[0].followingUsers.length) {
                return res.status(200).json({ success: true, message: "No following users found!", follows: [] });
            }
    
            return res.status(200).json({ success: true, follows: result[0].followingUsers });
    
        }
        catch(error) {
            return res.status(500).json({ success: false, message: "Failed to retrieve following users!", error: error.message });
        }
    }
    
    else{
        try {
            const result = await userModel.aggregate([
                // 1️⃣ Match all users who have userId in their 'following' array (i.e., followers)
                { $match: { following: new mongoose.Types.ObjectId(id) } },
    
                // 2️⃣ Project only required fields
                {
                    $project: {
                        _id: 1,
                        username: 1,
                        bio: 1,
                        profile_pic: 1
                    }
                }
            ]);
    
            // If no followers are found
            if (!result.length) {
                return res.status(200).json({ success: true, message: "No followers found!", follows: [] });
            }
    
            return res.status(200).json({ success: true, follows: result });
    
        }
        catch(error) {
            return res.status(500).json({ success: false, message: "Failed to retrieve followers!", error: error.message });
        }
    }
}

const dashboard = async (req, res) => {
    const id = req.user.userId

    try{
        const blogs = await blogModal.find({author: id}).select('_id -author -title -content -likes -tags -media').lean()
        const comments = await CommentModal.find({userId: id}).select('_id -userId -blogId -text -likesCount -parentId').lean()
        
        if(!blogs || !comments){
            throw new CustomError(505, { 'success': false, 'details': 'Unable to fetch Dashboard details!' })
        }
        else{
            return res.status(200).json({success: true, details: 'Successfully fetched Dashboard details!', totalBlogs: blogs.length, totalComments: comments.length})
        }
    }
    catch(error){
        throw new CustomError(500, { 'success': false, 'details': 'Unable to fetch Dashboard details!' })
    }
}





module.exports = { getUser, get, update, remove, followUpdate, follow, dashboard }
