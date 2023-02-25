const models = require("../models")
//bcryptjs
const bcrypt = require("bcryptjs")

const db = require("../models/database")

const jwt = require("jsonwebtoken")


exports.register = async (req,res) => {
    const {name,email,password} = req.body
    try{
        //تشفير كلمة المرور
        const hashPassword = await bcrypt.hash(password,10)
        //البحث عن الايميل
        const findEmail = await models.User.findOne({where:{email}})
        //في حالة عدم وجوده
        if(findEmail === null) {
            //انشاء مستخدم
        const user = await models.User.create({
            name,
            email,
            password:hashPassword
        })
        res.status(200).json({message:"created sucessfully"})
    }else{
        res.status(400).json({message:"email is insired"})
    }
    }catch(e){
        res.status(500).json(e)
    }
}


exports.login = async(req,res) => {
    const {email,password} = req.body
    
    try{
        user = await models.User.findOne({where:{email}})
        
        if(user === null) {
            res.status(401).json({message:"خطا في المعلومات المدخلة"})
        } else {
            const pass = await bcrypt.compare(password,user.password)
            if(pass) {
                //تشفير بيانات بعد تسجيل الدخول
                //اضافة المعرف والايميل الى رمز التحقق
                //توليد الرمز
                const token = jwt.sign({id:user.id,email:user.email},process.env.JWT)
                res.status(200).json({accessToken:token})
                //res.status(200).json({message:"تم تسجيل الدخول"})
            } else{
                res.status(401).json({message:"خطا في المعلومات المدخلة"})
            }
        }
    }catch(e){
        res.status(500)
    }
}

//جلب بيانات المستخدم الحالي
exports.getProfile = async(req,res) => {
    try{
        //اليحث غن المستخدم الحالي
        //جلب رمز المصادقة
        const user = await models.User.findOne({
            //اضافة طبقة وسيطة isLogged in
            where:{id:req.currentUser.id},
            attributes:{exclude:["password"]}

        })
        res.status(200).json(user)
    }catch(e){
        res.status(500).json(e)
    }

}

//رفع صورة المستخدم
exports.uploadUserPhoto = async(req,res) => {
    const url = req.protocol + "://" + req.get("host")
    try{
        const uploadPhoto = await models.User.update(
            //req file
            //الوصول الى الملفات داخل الطلب
            {
                img_uri:url + "/public/images/" + req.file.filename
            },

            {where:{id:req.currentUser.id}}
        );
        res.status(200).json({message:"تم اضافة الصورة بنجاح"})
    }catch(e){
        res.status(500).json(e)
    }
}


exports.updateProfile = async (req,res) => {
    const {name,password} = req.body
    try{
        const hashPassword = await bcrypt.hash(password,10)
        const update = await models.User.update({
            name,
            password:hashPassword
        },
        {
            where:{id:req.currentUser.id}
        }
        );
        res.status(200).json({message:"تم تعديل البيانات الشخصية"})
    }catch(e){
        res.status(500).json(e)
    }
}
//اضافة قواعد تحقق بعد تعديل الملف








//import file to routes
//same way
//module.exports =
//export dafualt...