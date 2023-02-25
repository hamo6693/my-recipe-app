//التحقق من مدخلات المستخدم المرسلة
const { body, validationResult } = require("express-validator");

const userValidationRules = () => {
    return[
        body("name").notEmpty().withMessage("اسم المستخدم مطلوب"),
        body("email").notEmpty().withMessage("البريد الالكتروني مطلوب"),
        body("password").notEmpty().withMessage("كلمة المرور مطلوبة"),
        body("password").isLength({min:5}).withMessage("يجب الا تقل كلمة المرور عن 5 محارف"),
    ]
}

const updateUserValidationRules = () => {
    return[
        body("name").notEmpty().withMessage("اسم المستخدم مطلوب"),
        body("password").notEmpty().withMessage("كلمة المرور مطلوبة"),
        body("password").isLength({min:5}).withMessage("يجب الا تقل كلمة المرور عن 5 محارف")

    ]
}

const postValidationRules = () => {
    return[
        body("title").notEmpty().withMessage("ادخل عنوان"),
        body("contents").notEmpty().withMessage("ادخل المحتوى"),
        body("steps").notEmpty().withMessage("حقل الخطوات فارغ"),
    ]
}
/*
const commentValidationRules = () => {
    return[
        body("text").notEmpty().withMessage("ادخل تعليق نصي"),
    ]
}
*/
//التاكد من مدخلات مرسلة وليست فارغة
const validate = (req,res,next) => {

    const errors = validationResult(req)
    
    if (errors.isEmpty()) {
        return next()
    }
    return res.status(400).json({errors:errors.array() })
}
module.exports = {
    userValidationRules,
    updateUserValidationRules,
    postValidationRules,
    //commentValidationRules,
    validate
}