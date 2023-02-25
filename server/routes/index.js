//استدعاء حزمة الخادم
const express = require("express")

const userController = require("../controller/userController")
const postController = require("../controller/postController")
const isLoggedIn = require("../middlewares/authentication")
const upload = require("../middlewares/upload")
const commentController = require("../controller/commentController")
//تحقق من المدخلات
const {userValidationRules,validate, updateUserValidationRules, postValidationRules} = require("../middlewares/validtor")
const  likeController  = require("../controller/likeController")

//توجية الحزمة
const router = express.Router()


router.get("/",(req,res) => {
    res.json({
        message:"hello word"
    })
})
//لتوجيه المستخدم
//التحقق من المدخلات
router.post("/account/register",userValidationRules(),validate,userController.register)
router.post("/account/login",userController.login);
//ملف فك التشفير+دالة استجلاب البيانات
router.get("/account/profile",isLoggedIn,userController.getProfile);
router.put("/account/profile/upload-photo",upload.single("avatar"),isLoggedIn,userController.uploadUserPhoto);
router.put("/account/profile/update",updateUserValidationRules(),validate,isLoggedIn,userController.updateProfile);
//انشاء منشور
//استخدام مكتبة ملتر لرفع الصور
router.post("/posts/create",upload.array("postImg",5),postValidationRules(),validate,isLoggedIn,postController.newPost)
router.get("/posts",isLoggedIn,postController.getAllPosts)
router.get("/posts/:postId",isLoggedIn,postController.getPost)

router.get("/my-posts",isLoggedIn,postController.getAllPosts)

router.get("/my-posts/:postId",isLoggedIn,postController.getMyPost)
router.get("/my-posts/:postId",isLoggedIn,postController.getMyPost)
router.put("/my-posts/:postId/update",postValidationRules(),validate,isLoggedIn,postController.updateMyPost)
router.delete("/my-posts/delete",isLoggedIn,postController.deleteMyPost)


router.post("/posts/:postId/create-comment",isLoggedIn,commentController.createComment)
router.get("/posts/:postId/get-comments",isLoggedIn,commentController.getComment)

router.put("/posts/:postId/like",isLoggedIn,likeController.like)
router.get("/posts/:postId/like-count",isLoggedIn,likeController.likeCount)






module.exports = router;