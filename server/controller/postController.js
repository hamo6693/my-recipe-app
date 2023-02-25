const models = require("../models")

const fs = require("fs/promises")

exports.newPost = async(req,res) => {
    const {title,contents,steps,country,region} = req.body
    //بروتكول الاستضافة
    const url = req.protocol + "://" + req.get("host")
    try{
        //انشاء منشور
        //استدعاء النموذج ودالة المنشورات
        const post = await models.Post.create({
            title,
            contents,
            steps,
            country,
            region,
            //جلب المستخدم حاليا
            //current userيحتوي على المعرف والايميل 
            UserId:req.currentUser.id
        })
        //لاضافة الصور في قواعد البيانات
        req.files.map(async function(file){

            const post_img = await models.Post_Image.create({
                //رابط الصورة
                img_uri:url + "/public/images/" + file.filename,
                //نشر الصور
                PostId:post.id
            })
        })
        res.status(200).json({message:"تمت اضافة منشور"})    
    }catch(e){
        res.status(500).json(e)
    }
}


//الحصول على جميع المنشورات
exports.getAllPosts = async(req,res) => {
    try{
        const getPosts = await models.Post.findAll({
        //لجلب نموذج
            include:[
                {
                    model:models.User,
                    attributes:{exclude:["email","password"]}
                },
                {
                    model:models.Post_Image
                }                
            ]
        })
        res.status(200).json(getPosts)
    }catch(e){
        res.status(500).json(e)
    }
}

//البحث عن منشور
exports.getPost = async(req,res) => {
    try{
        const post = await models.Post.findOne({
            //البحث عن منشور داخل الطلب
            where:{id:req.params.postId},
            //جلب بيانات
            include:[
                {
                    model:models.User,
                    attributes:{exclude:["email","password"]}
                },
                {
                    model:models.Post_Image
                }                
            ]
        })
        res.status(200).json(post)
    }catch(e){
        res.status(500).json(e)
    }
}


// جلب على جميع المنشوارت الشخصية
exports.getMyAllPost = async(req,res) => {
    try{
        const myPosts = await models.Post.findAll({
            //البحث عن منشور داخل الطلب
            where:{UserId:req.currentUser.id},
            //جلب بيانات
            include:[
                {
                    model:models.Post_Image
                }                
            ]
        })
        res.status(200).json(myPosts)
    }catch(e){
        res.status(500).json(e)
    }
}


//دالة الحصول على منشور المستخدم
exports.getMyPost = async(req,res) => {
    try{
        const myPost = await models.Post.findOne({
            where:{
                UserId:req.currentUser.id,
                id:req.params.postId
            }
        });
        res.status(200).json(myPost)
    } catch(e){
        res.status(500).json(e)
    }
}



exports.updateMyPost = async(req,res) => {
    const {title,contents,steps} = req.body
    try{
        const updatePost = await models.Post.update(
            {
            title,
            contents,
            steps      
    },
    {
        where:{
            //حلب نعرف الطلب
            id:req.params.postId,
            //للمستخدم الحالي
            UserId:req.currentUser.id
        }
    }
    )
    res.status(200).json({message:"تم تعديل البيانات"})
    }catch(e) {
        res.status(500).json(e)
    }
}

exports.deleteMyPost = async(req,res) => {
    //معرف الطلب
    const {postId} = req.body;
    try{
        //البحث عن جميع الصور داخل منشور الطلب
        await models.Post_Image.findAll({
            where:{PostId:postId}
            //in case u find
        }).then(res => {
            //الحصول على بيانات الطلب
            res.map((img) =>{
                fs.unlink("./public/images/" + img.img_uri.split("/")[5],function(err){
                    if(err) throw err
                })
            })
        })
        //delete img and post from database
        await models.Post_Image.destroy({
            where:{PostId:postId}
        })
        await models.Comment.destroy({
            where:{PostId:postId}
        })
        await models.Like.destroy({
            where:{PostId:postId}
        })
        await models.Post.destroy({
            where:{id:postId,UserId:req.currentUser.id}
        })
        res.status(200).json({message:"deleta your post"})
    }catch(e) {
        res.status(500).json(e)
    }
}