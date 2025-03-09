const customError = require('../utils/customError')
const blogModal = require('../models/Blog')
const userModal = require('../models/User')



const search = async (req, res) => {
    const check = req.query.check || 'blog'                 // To Know Search Item  'blog' / 'user'...
    const q = req.query.q

    if(!q){
        return res.status(400).json({ success: false, details: "Please provide a search query!" });
    }

    if(check === 'blog') {                      //Blog search using MongoDB search index at 'DB side'...
        try {
            const blogs = await blogModal.aggregate([
                {
                    $search: {
                        index: "verseify_bolgSearchIndex",  // Use the  blog index
                        text: {
                            query: q,
                            path: ["title", "content"], // Searches in  'title' & 'content'
                            fuzzy: { maxEdits: 2 },
                        },
                    },
                },
                {
                    $project: { _id: 1, title: 1, media: 1 },
                },
            ])

            return res.status(200).json({ success: true, details: "Blog Search successful!", results: blogs })
        }
        catch(error) {
            return res.status(500).json({ success: false, details: "Error searching blogs!", error })
        }
    }

    else{                               //'User' search using Mongoose at 'Backend side'...
        try {
            const users = await userModal.find({
                $or: [
                    { username: { $regex: q, $options: "i" } },
                    { bio: { $regex: q, $options: "i" } },
                ],
            }).select("_id username profile_pic")

            return res.status(200).json({ success: true, details: "User Search successful!", results: users })
        }
        catch(error) {
            return res.status(500).json({ success: false, details: "Error searching users!", error })
        }
    }
}






module.exports = { search }