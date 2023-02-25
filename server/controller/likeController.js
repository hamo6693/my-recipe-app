const models = require("../models")

exports.like = async(req,res) => {
    
    try{
        const likedPost = await models.Like.findOne({
            where:{UserId: req.currentUser.id , PostId: req.params.postId }
        })
        if(likedPost) {
            await models.Like.destroy({
            where:{UserId: req.currentUser.id , PostId: req.params.postId }
            })
            res.status(200).json({message:"تم حذف الاعجاب"})
        }else{
            await models.Like.create({
            UserId: req.currentUser.id , 
            PostId: req.params.postId
            })
            res.status(200).json({message:"تمت اضافة الاعجاب"})
        }
    }catch(e) {
        res.status(500).json(e)
    }
}

exports.likeCount = async(req,res) => {
    try{
        //الحصول على اعجبات المنشور
        const likes = await models.Like.findAll({
            where:{PostId:req.params.postId}
        })
        //الحصول على اعجاب المستخدم للمنشور
        const userLiked = await models.Like.findOne({
            where:{UserId: req.currentUser.id, PostId:req.params.postId}
        })
        res.status(200).json({
            //عدد الاعجابات
            likes:likes.length,
            //اظهار اعجاب المستخدم
            userLiked
        })
    } catch(e){
        res.status(500).json(e)
    }
}