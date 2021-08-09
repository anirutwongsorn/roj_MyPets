const express = require("express");
const router = express.Router();
//const bcrypt = require("bcrypt");
const multer = require("multer");
const multerConfig = require("../config/multer_config");
const upload = multer(multerConfig.config).single(multerConfig.keyUploadPhoto);
const db = require("../models");
const authorization = require("../config/authorize");
const { uuid } = require("uuidv4");
const moment = require("moment-timezone");

let memAttr = [
  "id",
  "fname",
  "lname",
  "username",
  "avatar",
  "email",
  "phone",
  "userref",
  "recref",
  "district",
  "province",
  "bkaccno",
  "bkaccname",
  "bkacctype",
  "bkname",
  "bkbranch",
  "status",
  "level",
  "coin",
  "role",
  "created_at",
];

function getThaiDate() {
  return moment().tz("Asia/Bangkok").format();
}

function getCoinTransactionSQL() {
  var sql =
    "SELECT C.id, C.userid, C.billno, C.transtype, C.transdate, C.coinval, C.photoref, C.ischecked, C.checkedid, M.fname, M.lname, M.phone, M2.phone AS Tel ";
    sql += "FROM coin_transactions AS C LEFT JOIN members AS M ON C.userid = M.id ";
    sql += "LEFT JOIN members AS M2 ON C.checkedid = M2.id ";
  return sql;
}

//===========GET MEMBER DATA========
router.get("/member", authorization, async (req, res) => {
  const userid = req.id;
  try {
    console.log("------------------------------------------");
    const member = await db.members.findOne({
      where: { id: userid },
      attributes: memAttr,
    });
    res.status(200).json({ member: member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//===========GET MEMBER DATA========
router.get("/member_team", authorization, async (req, res) => {
  const userid = req.id;
  try {
    console.log("------------------------------------------");
    const member = await db.members.findOne({
      where: { id: userid },
      attributes: ["userref"],
    });

    const recref = member.userref;

    const team = await db.members.findAll({
      where: { recref: recref },
      attributes: memAttr,
    });

    res.status(200).json({ team: team });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//===========PUT UPDATE MEMBER DATA====================
router.put(
  "/member/member_info_management",
  authorization,
  async (req, res) => {
    try {
      const userid = req.id;
      const result = await db.members.findOne({
        where: { id: userid },
      });

      if (!result) {
        return res.status(404).json({ message: "Member not found!" });
      }

      updateMember(req, res, result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//===========PUT UPDATE MEMBER DATA====================
router.put(
  "/member/member_info_management_avatar",
  authorization,
  async (req, res) => {
    try {
      const userid = req.id;
      const result = await db.members.findOne({
        where: { id: userid },
      });

      if (!result) {
        return res.status(404).json({ message: "Member not found!" });
      }

      updateMemberAvatar(req, res, result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

//========GET COIN TRANSACTION=====
router.get("/member/coin_transaction", authorization, async (req, res) => {
  console.log(req.body);
  const userid = req.id;
  //const role = req.role;

  try {
    var sql = getCoinTransactionSQL();
    sql += `WHERE C.userid = ${userid} OR C.checkedid = ${userid} `;
    sql += 'ORDER BY C.id DESC ';
  
    var transf = await db.sequelize.query(sql, {
      type: db.sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({ transactions: transf });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//========POST COIN TRANSACTION=====
router.post("/member/coin_transaction", authorization, async (req, res) => {
  console.log(req.body);

  const userid = req.id;
  const data = {
    ...req.body,
    userid: userid,
    transtype: req.body.billno ? 0 : 1,
    phtoref: "",
    transdate: getThaiDate(),
    checked_at: getThaiDate(),
    ischecked: -1,
  };
  console.log(getThaiDate());
  try {
    const transf = await db.coin_transactions.create(data);
    res.status(200).json(transf);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//========POST COIN TRANSFER=====
router.post(
  "/member/coin_transfer/:phone/:coinval",
  authorization,
  async (req, res) => {
    console.log(req.body);

    const userid = req.id;
    const coinval = req.params.coinval;
    const phone = req.params.phone;

    var findFriend = await db.members.findOne({
      where: { username: phone },
      attributes: ["id"],
    });

    if (!findFriend) {
      return res.status(500).json({ message: "ไม่พบข้อมูลสมาขิก" });
    }

    //===========Looking source coin==========
    const member = await db.members.findOne({
      where: { id: userid },
      attributes: ["coin"],
    });

    if (!member) {
      return res.status(500).json({ message: "ไม่พบข้อมูลสมาขิก" });
    }

    //==========GET SOURCE COIN==========
    var jsonSource = JSON.parse(JSON.stringify(member));
    var coin = jsonSource["coin"];

    //==========GET DESC ID==========
    var jsonDestination = JSON.parse(JSON.stringify(findFriend));
    var transid = jsonDestination["id"];

    //========Check own coin=======
    if (coinval > coin) {
      return res.status(500).json({ message: "เหรียญของคุณไม่เพียงพอ" });
    }

    const data = {
      userid: transid,
      billno: "transfer",
      transtype: 50,
      //transdate: getThaiDate(),
      coinval: coinval,
      photoref: "no_image.png",
      checkedid: userid,
      ischecked: 50,
      //checked_at: getThaiDate(),
    };

    try {
      const transf = await db.coin_transactions.create(data);
      res.status(200).json(transf);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//========PUT CANCEL COIN TRANSACTION======
router.put(
  "/member/cancel_coin_transaction/:id",
  authorization,
  async (req, res) => {
    const id = req.params.id;
    const userid = req.id;

    const result = await db.coin_transactions.findOne({
      where: { id: id, userid: userid, ischecked: -1 },
    });

    if (!result) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    const data = {
      ...result,
      ischecked: 99,
      userid: userid,
      updated_at: getThaiDate(),
    };

    try {
      const [updated] = await db.coin_transactions.update(data, {
        where: {
          id: id,
          userid: userid,
          ischecked: -1,
        },
      });
      if (updated) {
        res.status(200).json({ message: "Completed" });
      } else {
        throw new Error("Data not found!");
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//========PUT PAY SLIP COIN TRANSACTION======
router.put(
  "/member/confirm_coin_transaction/:id",
  authorization,
  async (req, res) => {
    const id = req.params.id;
    const userid = req.id;

    const result = await db.coin_transactions.findOne({
      where: { id: id, userid: userid, ischecked: -1 },
    });

    if (!result) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    console.log(result);
    updatePaySlip(req, res, id);
  }
);

//========PUT VERIFY PAY SLIP SALE======
router.put(
  "/member/verify_sale_transaction/:id",
  authorization,
  async (req, res) => {
    const id = req.params.id;
    const userid = req.id;

    if (!userid) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    const result = await db.product_mains.findOne({
      where: { id: id, ownerid: userid, ischecked: 1 },
    });

    if (!result) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    const data = {
      ...result,
      ischecked: 10,
      updated_at: getThaiDate(),
    };

    try {
      const [updated] = await db.product_mains.update(data, {
        where: {
          id: id,
          ownerid: userid,
          ischecked: 1,
        },
      });

      //====Generate Billno RefCode=========
      var uid = uuid();
      const chars = uid.split("-");

      var billno = chars[0];

      var json = JSON.parse(JSON.stringify(result));
      var buyerid = json["buyerid"];
      var buyerid = json["buyerid"];
      var nextdate = json["nextdate"];
      var pressentPrice = json["nextprice"];
      var billref = json["billno"];
      var pid = json["pid"];
      var typeid = json["typeid"];
      var fee = 0,
        reservedfee = 0,
        priceup = 0,
        nextday = 0,
        nextprice = 0;

      //========Get product type=============
      const product_type = await db.product_types.findOne({
        where: { typeid: typeid },
      });

      if (product_type) {
        var pdtype = JSON.parse(JSON.stringify(product_type));
        fee = pdtype["coinfee"];
        reservedfee = pdtype["reservedfee"];
        priceup = pdtype["priceup"];
        nextday = pdtype["nextday"];

        nextprice = pressentPrice + pressentPrice * (priceup / 100);
      }

      var _nextDate = new Date(nextdate);

      if (updated) {
        const create = {
          billno: billno,
          pid: pid,
          typeid: typeid,
          price: pressentPrice,
          nextprice: nextprice,
          ownerid: buyerid,
          buyerid: 0,
          fee: fee,
          reservedfee: reservedfee,
          datesale: nextdate,
          nextdate: addDays(_nextDate, nextday),
          ischecked: -1,
          iscancel: 0,
          billref: billref,
        };

        const product = await db.product_mains.create(create);

        res.status(200).json({ message: product });
      } else {
        throw new Error("Transaction not found!");
      }
    } catch (err) {
      console.log("Server error: " + err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

//========PUT VERIFY PAY SLIP BLACKLIST======
router.put(
  "/member/assign_buyer_blacklist/:id",
  authorization,
  async (req, res) => {
    const id = req.params.id;
    const userid = req.id;

    if (!userid) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    const result = await db.product_mains.findOne({
      where: { id: id, ownerid: userid, ischecked: 0 },
    });

    if (!result) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    const data = {
      ...result,
      ischecked: 999,
      updated_at: getThaiDate(),
    };

    try {
      const [updated] = await db.product_mains.update(data, {
        where: {
          id: id,
          ownerid: userid,
          ischecked: 0,
        },
      });

      //====Generate Billno RefCode=========
      var uid = uuid();
      const chars = uid.split("-");

      var billno = chars[0];

      var json = JSON.parse(JSON.stringify(result));
      var datesale = json["datesale"];
      var nextdate = json["nextdate"];
      var price = json["price"];
      var pid = json["pid"];
      var typeid = json["typeid"];
      var fee = json["fee"];
      var reservedfee = json["reservedfee"];
      var nextprice = json["nextprice"];

      if (updated) {
        const create = {
          billno: billno,
          pid: pid,
          typeid: typeid,
          price: price,
          nextprice: nextprice,
          ownerid: userid,
          buyerid: 0,
          fee: fee,
          reservedfee: reservedfee,
          datesale: datesale,
          nextdate: nextdate,
          ischecked: -1,
          iscancel: 0,
          billref: "",
        };

        const product = await db.product_mains.create(create);

        res.status(200).json({ message: product });
      } else {
        throw new Error("Transaction not found!");
      }
    } catch (err) {
      console.log("Server error: " + err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

//========PUT CANCEL PAY SLIP SALE======
router.put(
  "/member/cancel_sale_transaction/:id",
  authorization,
  async (req, res) => {
    const id = req.params.id;
    const userid = req.id;

    if (!userid) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    const result = await db.product_mains.findOne({
      where: { id: id, ownerid: userid, ischecked: 1 },
    });

    if (!result) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    const data = {
      ...result,
      ischecked: 99, //Status cancel
      updated_at: getThaiDate(),
    };

    try {
      const [updated] = await db.product_mains.update(data, {
        where: {
          id: id,
          ownerid: userid,
          ischecked: 1,
        },
      });
      if (updated) {
        res.status(200).json({ message: "Completed" });
      } else {
        throw new Error("Transaction not found!");
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//========Upload pay slip================
function updatePaySlip(req, res, id) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log("error: " + JSON.stringify(err));
      return res.status(500).json({ message: err.message });
    } else if (err) {
      console.log("error: " + JSON.stringify(err));
      return res.status(500).json({ message: err.message });
    }

    const data = {
      ...req.body,
      photoref: req.file ? req.file.filename : "",
      ischecked: req.file ? 0 : -1,
      checkeid: 0,
      updated_at: getThaiDate(),
    };

    console.log(JSON.stringify(data));

    try {
      const [updated] = await db.coin_transactions.update(data, {
        where: {
          id: id,
        },
      });
      if (updated) {
        res.status(200).json({ message: "Completed." });
      } else {
        throw new Error("Transaction not found!");
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
}

//========Update member profile==========
function updateMember(req, res, member) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log("error: " + JSON.stringify(err));
      return res.status(500).json({ message: err.message });
    } else if (err) {
      console.log("error: " + JSON.stringify(err));
      return res.status(500).json({ message: err.message });
    }

    const data = {
      ...req.body,
      bkaccno: req.body.bkaccno === undefined ? "" : req.body.bkaccno,
      bkaccname: req.body.bkaccname === undefined ? "" : req.body.bkaccname,
      bkacctype: req.body.bkacctype === undefined ? "" : req.body.bkacctype,
      bkname: req.body.bkname === undefined ? "" : req.body.bkname,
      bkbranch: req.body.bkbranch === undefined ? "" : req.body.bkbranch,
      district: req.body.district === undefined ? "" : req.body.district,
      province: req.body.province === undefined ? "" : req.body.province,
      avatar: req.file ? req.file.filename : undefined,
    };

    try {
      const [updated] = await db.members.update(data, {
        where: {
          id: member.id,
        },
      });
      if (updated) {
        //const updateMember = await db.members.findByPk(member.id);
        res.status(200).json({ message: "Completed" });
      } else {
        throw new Error("Member not found!");
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
}

//========Update member Avatar==========
function updateMemberAvatar(req, res, member) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log("error: " + JSON.stringify(err));
      return res.status(500).json({ message: err.message });
    } else if (err) {
      console.log("error: " + JSON.stringify(err));
      return res.status(500).json({ message: err.message });
    }

    const data = {
      ...member,
      avatar: req.file ? req.file.filename : undefined,
    };

    try {
      const [updated] = await db.members.update(data, {
        where: {
          id: member.id,
        },
      });
      if (updated) {
        //const updateMember = await db.Members.findByPk(member.id);
        res.status(200).json({ message: "Completed" });
      } else {
        throw new Error("Member not found!");
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = router;
