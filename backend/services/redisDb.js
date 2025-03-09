const redisClient = require('../redisConfig')


const redisPost = async(_id, passwordModifiedAt)=>{        //Post & Update
    // Store in Redis (expires in 1 hour)
    try{
        const r = await redisClient.setEx(_id, 3600, JSON.stringify({ _id, passwordModifiedAt }))
        return res.status(201).json({success: true, user: r})
    }
    catch(error){
        return res.status(500).json({success: false, error})
    }
}


const redisGet = async(_id)=>{     //Get
    try{
        const cachedUser = await redisClient.get(_id)
        const r = JSON.parse(cachedUser)
        return res.status(200).json({success: true, user: r})
    }
    catch(error){
        return res.status(500).json({success: false, error})
    }
}


const redisDelete = async(_id)=>{     //Delete
    try{
        const result = await redisClient.del(_id)
        if(result){
            return res.status(200).json({success: true, result})
        }
        return res.status(404).json({success: false, _id})
    }
    catch(error){
        return res.status(500).json({success: false, error})
    }
}


module.exports = {redisPost, redisGet, redisDelete}
