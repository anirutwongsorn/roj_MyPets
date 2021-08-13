const express = require("express");
const router = express.Router();
const db = require("../models");
const authorization = require("../config/authorize");
const dateFormat = require("dateformat");
const { v4: uuidv4 } = require("uuid");

let _bookBank = [
  "bkname",
  "bkbranch",
  "bkaccno",
  "bkacctype",
  "bkaccname",
  "isprimary",
];

function getProductSaleSqlCommand() {
  var sql =
    "SELECT S.id, S.pid, P.typeid, P.title, P.pdesc1, P.pdesc2, P.pdesc3, P.pdesc4, P.pdesc5, P.image, P.image2, P.image3, P.mindisp, ";
  sql +=
    "S.billno, S.typeid, S.price, S.datesale, S.nextdate, T.coinfee, T.reservedfee, T.nextday, T.priceup, T.maxprice, S.ownerid, U.fname, U.lname, ";
  sql += "U.bkaccno, U.bkaccname, U.bkacctype, U.bkname, U.bkbranch, ";
  sql += "S.buyerid, S.photoref, U2.fname AS buyername, U2.lname AS buyerlastname, ";
  sql += "S.ischecked , ";
  sql += "CONVERT_TZ(S.created_at,'+00:00','+7:00') as created_at, ";
  sql += "CONVERT_TZ(S.updated_at,'+00:00','+7:00') as updated_at ";
  sql += "FROM products AS P ";
  sql += "JOIN product_mains AS S ON P.pid = S.pid ";
  sql += "JOIN product_types AS T ON S.typeid = T.typeid ";
  sql += "JOIN members AS U ON S.ownerid = U.id ";
  sql += "LEFT JOIN members AS U2 ON S.buyerid = U2.id ";
  return sql;
}

//===========POST PRODUCT FOR SALE====================
router.post("/admin/productforsale", authorization, async (req, res) => {
  if (req.role !== 1) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }

  //========Get product type=============
  const typeid = req.body.typeid;
  const product_type = await db.product_types.findOne({
    where: { typeid: typeid },
  });

  if (product_type) {
    var pdtype = JSON.parse(JSON.stringify(product_type));
    fee = pdtype["coinfee"];
    reservedfee = pdtype["reservedfee"];
    priceup = pdtype["priceup"];
    nextday = pdtype["nextday"];

    const price = req.body.price;
    nextprice = price + price * (priceup / 100);
  }

  //====Generate RefCode=========
  var uid = uuidv4();
  const chars = uid.split("-");

  var billno = chars[0];
  const data = {
    ...req.body,
    billno: billno,
    fee: fee,
    reservedfee: reservedfee,
    buyerid: 0,
    nextprice: nextprice,
    nextdate: addDays(Date(), nextday),
    ischecked: -1,
    iscancel: 0,
    billref: "-",
  };

  try {
    const product = await db.product_mains.create(data);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//========PUT VERIFY PAY SLIP COIN TRANSACTION======
router.put(
  "/admin/verify_coin_transaction/:id",
  authorization,
  async (req, res) => {
    if (req.role !== 1) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }

    const id = req.params.id;
    const userid = req.id;

    if (!userid) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    const result = await db.coin_transactions.findOne({
      where: { id: id, transtype: 1 },
    });

    if (!result) {
      return res.status(404).json({ message: "Transaction not found!" });
    }

    const data = {
      ...result,
      ischecked: 1,
      checkedid: userid,
      checked_at: Date(),
    };

    try {
      const [updated] = await db.coin_transactions.update(data, {
        where: {
          id: id,
          ischecked: 0,
        },
      });
      if (updated) {
        res.status(200).json({ message: "Completed" });
      } else {
        throw new Error("Transaction not found!");
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }
);

//========GET ADMIN BOOK BANK=======
router.get("/admin/master_book_bank", authorization, async (req, res) => {
  try {
    const bookbank = await db.owner_book_banks.findAll({
      attrubutes: _bookBank,
    });
    res.status(200).json({ bookbank: bookbank });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//========GET COIN TRANSACTION ALL=====
router.get("/admin/coin_transaction", authorization, async (req, res) => {
  // console.log(req.body);
  const role = req.role;

  if (role !== 1) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized",
    });
  }

  try {
    const { Op } = require("sequelize");
    const transf = await db.coin_transactions.findAll({
      where: {
        ischecked: {
          [Op.lt]: 99,
        },
      },
      order: [["id", "DESC"]],
    });
    res.status(200).json({ transactions: transf });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//========GET TIME SETTING=======
router.get("/admin/playing_time", authorization, async (req, res) => {
  console.log("admin/playing_time");
  try {
    const transf = await db.playing_time.findOne({
      attrubutes: ["inittime", "endtime"],
    });

    var dayinit = new Date(
      dateFormat(new Date(), "yyyy-mm-dd ") + transf["inittime"]
    ).getTime();
    var dayend = new Date(
      dateFormat(new Date(), "yyyy-mm-dd ") + transf["endtime"]
    ).getTime();
    var dayNow = new Date().getTime();

    var playing = {
      inittime: transf["inittime"],
      endtime: transf["endtime"],
      intime: dayNow >= dayinit && dayNow <= dayend,
    };

    res.status(200).json({ playing: playing });
    // res
    //   .status(200)
    //   .json({ playing: playing, intime: dayNow >= dayinit && dayNow <= dayend });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//===========GET PRODUCT FOR SALE=================
router.get(
  "/admin/productforsale/:checkedid",
  authorization,
  async (req, res) => {
    const checkedid = req.params.checkedid;

    if (req.role !== 1) {
      return res.status(401).json({
        status: 401,
        message: "Unauthorized",
      });
    }

    var day = dateFormat(new Date(), "yyyy-mm-dd");

    try {
      var sql = getProductSaleSqlCommand();
      sql += `WHERE S.ischecked = ${checkedid}`;
      //sql += "WHERE S.ischecked = " + checkedid + " AND S.ownerid <> " + userid + " AND S.datesale = '" + day + "' ";

      var product = await db.sequelize.query(sql, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      console.log(day);

      res.status(200).json({ product: product });
    } catch (err) {
      console.log("Server error: " + err);
      res.status(500).json({ message: err.message });
    }
  }
);

//=======addDays==========
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

module.exports = router;
