const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // ใช้งาน jwt module
const fs = require("fs"); // ใช้งาน file system module ของ nodejs
const db = require("../models");
const bcrypt = require("bcrypt");
const { uuid } = require("uuidv4");

// router.get("/account/login", function (req, res, next) {
//   // ใช้ค่า privateKey เป็น buffer ค่าที่อ่านได้จากไฟล์ private.key ในโฟลเดอร์ config
//   const privateKey = fs.readFileSync(__dirname + "/../config/private.key");
//   // สมมติข้อมูลใน payload เช่น id , name , role ค่าเหล่านี้ เราจะเอาจากฐานข้อมูล กรณีทำการล็อกอินจริง
//   const payload = {
//     id: 20134,
//     name: "ebiwayo",
//     role: "admin",
//   };
//   // ทำการลงชื่อขอรับ token โดยใช้ค่า payload กับ privateKey
//   const token = jwt.sign(payload, privateKey);
//   // เมื่อเราได้ค่า token มา ในที่นี้ เราจะแสดงค่าใน textarea เพื่อให้เอาไปทดสอบการทำงานผ่าน postman
//   // ในการใช้งานจริง ค่า token เราจะส่งไปกับ heaer ในขั้นตอนการเรียกใช้งาน API  เราอาจจะบันทึก
//   // ไว้ใน localStorage ไว้ใช้งานก็ได้
//   return res(200).json({ token: token });
// });

let memAttr = [
  "id",
  "fname",
  "lname",
  "username",
  "password",
  "avatar",
  "email",
  "phone",
  "userref",
  "recref",
  "district",
  "province",
  "status",
  "level",
  "coin",
  "role",
  "created_at",
];

router.post("/account/login", async (req, res) => {
  try {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username, password);
    //===========Looking username/password=============
    const result = await db.members.findOne({
      where: { username: username },
      attributes: memAttr,
    });
    if (!result) {
      return res.status(401).json({
        status: 401,
        message: "Username/Password is invalid",
      });
    }
    console.log("Verify password");
    //===========Verify password=============
    const validPassword = await bcrypt.compare(password, result.password);
    console.log(validPassword);
    if (!validPassword) {
      return res.status(401).json({
        status: 401,
        message: "Username/Password is invalid",
      });
    }

    let mydate = addDays(Date(), 1);
    //let mydate = new Date();
    if (validPassword) {
      const privateKey = fs.readFileSync(__dirname + "/../config/private.key");
      const payload = {
        id: result.id,
        role: result.role,
        status: result.status,
        expired: mydate.toDateString(),
      };

      //===========Generate token===================
      result.password = "";
      const token = await jwt.sign(payload, privateKey);
      return res
        .status(200)
        .json({ status: 200, member: result, token: token });
    }
  } catch (error) {
    return res.status(401).json({
      status: 401,
      message: "Username/Password is invalid",
    });
  }
});

router.post("/account/register", async (req, res) => {
  let pass = await hashPassword(req.body.password);
  req.body.password = pass;

  console.log('recref: '+ req.body.recref);

  //====Generate RefCode=========
  var uid = uuid();
  const chars = uid.split("-");

  const data = {
    ...req.body,
    image: "",
    userref: chars[0].substring(2, 7),
  };

  try {
    //====Checking Username=========
    var sql = 'SELECT phone FROM members WHERE phone='+ data.phone + ' ';
    var chk_username = await db.sequelize.query(sql, {
      // replacements: { phone: data.phone },
      type: db.sequelize.QueryTypes.SELECT,
    });

    if (chk_username.length > 0) {
      console.log("เบอร์โทรศัพท์นี้เป็นสมาชิกแล้ว");
      return res
        .status(404)
        .json({ message: "เบอร์โทรศัพท์นี้เป็นสมาชิกแล้ว" });
    }

    //====Checking userref=========
    var chkRef = await db.members.findOne({
      where: { userref: req.body.recref },
      attributes: ["id"],
    });

    if (!chkRef) {
      console.log("รหัสผู้แนะนำไม่ถูกต้อง");
      return res.status(404).json({ message: "รหัสผู้แนะนำไม่ถูกต้อง" });
    }

    const member = await db.members.create(data);
    res.status(200).json(member);
  } catch (err) {
    console.log("Error message: " + err.message);
    res.status(500).json({ message: err.message });
  }
});

async function hashPassword(userpass) {
  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);
  // now we set user password to hashed password
  return await bcrypt.hash(userpass, salt);
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = router;
