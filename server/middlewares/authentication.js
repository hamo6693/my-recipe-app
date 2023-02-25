//فك تشفير البيانات والمصادقة في عملية تسجيل الدخول
const jwt = require("jsonwebtoken")

//دالة مصادقة تسجيل الدخول
const isLoggedIn = (req,res,next) => {
    try{
        //جلب التشفير من ترويسة الطلب
        //التحقق من الرمز الدخول
        const token = req.headers.authorization
        if(!token) {
            res.status(401).json({message:"لم يتم الحصول على رمز الدخول"})
        }
        //فك تشفير رمز التحقق
        const decoded = jwt.verify(token,process.env.JWT)
        //حفظ الرمز
        //currentuser يحتوي على المعرف والايميل
        //يحنوي على تفاصيل مسجل الدخول
        req.currentUser = decoded
        next();
    } catch(e){
        res.status(500).json(e)
    }
}
module.exports = isLoggedIn