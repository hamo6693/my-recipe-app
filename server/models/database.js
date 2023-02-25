
const {Sequelize} = require("sequelize");


const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
     {
    host:process.env.DB_HOST,
    dialect: "postgres",
    //لاخفاء المدخلات في التيرمنال
    logging:false
  });

  db.authenticate().then(() => {
    console.log("connection successfully");
  }).catch(err => {
    console.error("unable to connect",err);
  })

  module.exports = db;