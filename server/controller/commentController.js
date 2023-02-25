//ربط التعليفات مع المستخدم والمنشور
const models = require("../models")

exports.createComment = async (req,res) => {
    const{text} = req.body
    try{
        const comment = await models.Comment.create({
            text,
            //جلب المنشور
            //وضعه في قاعدة البيانات
            PostId:req.params.postId,
            //جلب المستخدم الحالي
            UserId:req.currentUser.id
        })
        res.status(200).json({message:"تمت اضافة تعليق"})
    } catch(e){
        res.status(500).json(e)

    }
}

//جلب تعليقات داخل المنشور
exports.getComment = async (req,res) => {
    try{
        //البحث عن العليقات
        const comment = await models.Comment.findAll({
            //البحث عن المنشور
            where:{PostId:req.params.postId},
            //جلب نعلومات المستخدم
            include:{
                model:models.User,
                attributes: {exclude:["email","password"]}
            }
        })
        res.status(200).json(comment)
    } catch(e){
        res.status(500).json(e)

    }
}