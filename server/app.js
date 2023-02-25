require("dotenv").config()
const express = require("express")
const router = require("./routes")
// وتحقق من الطلبhttp لترويسة طلب
const cors = require("cors")
//معرفة حالة الطلب
const morgan = require("morgan")
//التعامل مع طلبات جسم الصفحة والواجهات الامامبة
const bodyParser = require("body-parser")
const db = require("./models/database")
// indexاستدعاء النماذج من 
const models = require("./models")



//جلب المنفذ
const port = process.env.PORT


const app = express()
app.use(cors())
app.use(morgan("dev"))

app.use(bodyParser.urlencoded({extended:false}))
//تحويل الطلبات الى صيغة
app.use(bodyParser.json())
//لفتح الصورة في المتصفح
app.use("*/images",express.static(__dirname + "/public/images"))
app.use("/",router)


db.sync({alter:true}).then(() => {
    app.listen(port,() => {
        console.log("server work on port : " + port)
    })
})

