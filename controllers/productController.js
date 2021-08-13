const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerConfig = require("../config/multer_config");
const upload = multer(multerConfig.config).single(multerConfig.keyUploadPhoto);
const db = require("../models");
const authorization = require("../config/authorize");
const moment = require("moment-timezone");
const dateFormat = require("dateformat");

const productAttributes = [
  "id",
  "typeid",
  "title",
  "pdesc1",
  "pdesc2",
  "pdesc3",
  "pdesc4",
  "pdesc5",
  "image",
  "image2",
  "image3",
  "mindisp",
];

function getThaiDate() {
  return moment().tz("Asia/Bangkok").format();
}

// function getProductSaleSqlCommand() {
//   var sql =
//     "SELECT S.id, S.pid, P.typeid, P.title, P.pdesc1, P.pdesc2, P.pdesc3, P.pdesc4, P.pdesc5, P.image, P.image2, P.image3, P.mindisp, ";
//   sql +=
//     "S.billno, S.typeid, S.price, S.datesale, S.nextdate, T.coinfee, T.reservedfee, T.nextday, T.priceup, T.maxprice, S.ownerid, U.fname, U.lname, ";
//   sql += "U.bkaccno, U.bkaccname, U.bkacctype, U.bkname, U.bkbranch, ";
//   sql += "S.buyerid, S.photoref, S.ischecked , ";
//   sql += "CONVERT_TZ(S.created_at,'+00:00','+7:00') as created_at, ";
//   sql += "CONVERT_TZ(S.updated_at,'+00:00','+7:00') as updated_at ";
//   sql += "FROM products AS P ";
//   sql += "JOIN product_mains AS S ON P.pid = S.pid ";
//   sql += "JOIN product_types AS T ON S.typeid = T.typeid ";
//   sql += "JOIN members AS U ON S.ownerid = U.id ";
//   return sql;
// }
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

router.get("/product", authorization, async (req, res) => {
  try {
    const result = await db.products.findAll({
      attributes: productAttributes,
    });
    res.status(200).json({ product: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//===========GET PRODUCT TYPE=====================
router.get("/product/product_type", authorization, async (_, res) => {
  try {
    const product_type = await db.product_types.findAll();
    res.status(200).json({ product: product_type });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//===========GET PRODUCT FOR SALE=================
router.get(
  "/product/productforsale/:checkedid",
  authorization,
  async (req, res) => {
    const checkedid = req.params.checkedid;

    const userid = req.id;
    var day = dateFormat(new Date(), "yyyy-mm-dd");

    try {
      var sql = getProductSaleSqlCommand();
      sql += `WHERE S.ischecked = ${checkedid} AND S.ownerid <> ${userid} AND S.datesale <= '${day}'`;

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

//===========GET PRODUCT FOR SALE BY USER ID=====================
router.get(
  "/product/productforsaleByUserId",
  authorization,
  async (req, res) => {
    let userid = req.id;
    try {
      var sql = getProductSaleSqlCommand();
      sql += `WHERE S.buyerid = ${userid}`;

      var product = await db.sequelize.query(sql, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      res.status(200).json({ product: product });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//===========GET PRODUCT FOR SALE BY OWNER ID=====================
router.get(
  "/product/productforsaleBySellerId",
  authorization,
  async (req, res) => {
    let userid = req.id;
    try {
      var sql = getProductSaleSqlCommand();
      sql += `WHERE S.ownerid = ${userid}`;

      var product = await db.sequelize.query(sql, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      res.status(200).json({ product: product });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//===========GET PRODUCT FOR SALE BY PRODUCT ID=====================
router.get(
  "/product/productforsalebyid/:pid",
  authorization,
  async (req, res) => {
    const pid = req.params.pid;
    let userid = req.id;

    try {
      var sql = getProductSaleSqlCommand();
      sql += `WHERE S.ischecked = -1 AND S.pid = ${pid} AND S.ownerid != ${userid} `;

      console.log(sql);

      var product = await db.sequelize.query(sql, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      res.status(200).json({ product: product });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//===========GET PRODUCT FOR SALE BY BUYER ID & ORDER ID=====================
router.get(
  "/product/productforsalebyOrderId/:payid",
  authorization,
  async (req, res) => {
    const payid = req.params.payid;
    let userid = req.id;

    try {
      var sql = getProductSaleSqlCommand();
      sql += `WHERE S.id = ${payid} AND S.buyerid = ${userid} `;

      //console.log(sql);

      var order = await db.sequelize.query(sql, {
        type: db.sequelize.QueryTypes.SELECT,
      });
      console.log(JSON.stringify(order));
      res.status(200).json({ order: order });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//===========GET PRODUCT FOR SALE BY OWNER ID & ORDER ID=====================
router.get(
  "/product/productforsalebyOwnerId/:payid",
  authorization,
  async (req, res) => {
    const payid = req.params.payid;
    let userid = req.id;

    try {
      var sql = getProductSaleSqlCommand();
      sql += `WHERE S.id = ${payid} AND S.ownerid = ${userid} `;

      //console.log(sql);

      var order = await db.sequelize.query(sql, {
        type: db.sequelize.QueryTypes.SELECT,
      });
      console.log(JSON.stringify(order));
      res.status(200).json({ order: order });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

//===========PUT ORDER PRODUCT=====================
router.put(
  "/product/productsale_order/:pid/:qty",
  authorization,
  async (req, res) => {
    let userid = req.id;
    let pid = req.params.pid;
    let qty = req.params.qty;

    //==============GET MEMBER===========
    const member = await db.members.findOne({
      where: { id: userid },
      attributes: ["coin"],
    });

    let _coin = 0;
    if (!member) {
      return res.status(404).json({ message: "Member data not found!" });
    }

    var json = JSON.parse(JSON.stringify(member));
    _coin = json["coin"];
    console.log("member coin: " + _coin);

    if (_coin == 0) {
      console.log("Coin is not enough!");
      return res.status(500).json({ message: "Coin is not enough!" });
    }

    try {
      var day = dateFormat(new Date(), "yyyy-mm-dd");
      var sql = getProductSaleSqlCommand();
      sql += `WHERE S.ischecked = -1 AND S.pid = ${pid} AND S.datesale <= '${day}' `;
      sql += `ORDER BY S.id `;

      var product = await db.sequelize.query(sql, {
        type: db.sequelize.QueryTypes.SELECT,
      });

      let _pdcount = product.length;
      let _countSave = 0;

      if (_pdcount < qty) {
        qty = _pdcount;
      }

      for (let i = 0; i <= qty - 1; i++) {
        let id = product[i].id;
        let fee = product[i].coinfee;
        let reservedfee = product[i].reservedfee;

        _coin = _coin - (fee + reservedfee);
        if (_coin <= 0) {
          break;
        }

        console.log("member coin: " + _coin);

        let result = await db.product_mains.findOne({
          where: { id: id, pid: pid, ischecked: -1, iscancel: 0 },
        });

        if (result) {
          const data = {
            ...result,
            ischecked: 0,
            buyerid: userid,
          };

          await db.product_mains.update(data, {
            where: {
              id: id,
              pid: pid,
              ischecked: -1,
              iscancel: 0,
            },
          });
          _countSave++;
        }
      }
      console.log(`Save ${_countSave} completed`);
      res
        .status(200)
        .json({ message: `Save ${_countSave} completed`, saved: _countSave });
      //res.status(200).json({ product: _pd });
    } catch (err) {
      console.log("Server error: " + err.message);
      res.status(500).json({ message: err.message });
    }
  }
);

//========PUT PAY SLIP FOR ORDER PRODUCT======
router.put(
  "/product/confirm_order_transaction/:payid",
  authorization,
  async (req, res) => {
    const payid = req.params.payid;
    const userid = req.id;

    const result = await db.product_mains.findOne({
      where: { id: payid, buyerid: userid, ischecked: 0 },
    });

    if (!result) {
      return res.status(404).json({ message: "Your order not found!" });
    }

    console.log(result);
    updatePaySlip(req, res, payid);
  }
);

//===========POST====================
router.post("/product", authorization, (req, res) => {
  if (req.role !== 1) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }

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
      image: req.file ? req.file.filename : undefined,
    };

    try {
      const product = await db.products.create(data);
      res.status(200).json(product);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
});

//===========PUT MANAGE PRODUCT====================
router.put("/product/:id", authorization, async (req, res) => {
  if (req.role !== 1) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }

  try {
    const result = await db.products.findOne({
      where: { id: req.params.id },
    });

    if (!result) {
      return res.status(404).json({ message: "Product not found!" });
    }

    updateProduct(req, res, result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//===========DELETE====================
router.delete("/product/:id", authorization, async (req, res) => {
  if (req.role !== 1) {
    return res.status(401).json({ status: 401, message: "Unauthorized" });
  }

  try {
    const deleteProduct = await db.products.destroy({
      where: { id: req.params.id },
    });

    if (!deleteProduct) {
      return res.status(404).json({ message: "Product not found!" });
    } else {
      return res.status(204).json({ message: "Product deleted" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function updateProduct(req, res, product) {
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
      image: req.file ? req.file.filename : undefined,
    };

    try {
      const [updated] = await db.products.update(data, {
        where: {
          id: product.id,
        },
      });
      if (updated) {
        const updateProduct = await db.products.findByPk(product.id);
        res.status(200).json(updateProduct);
      } else {
        throw new Error("Product not found!");
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
}

//========Upload pay slip================
function updatePaySlip(req, res, id) {
  let userid = req.id;
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
      ischecked: req.file ? 1 : 0,
      buyerid: userid,
      updated_at: Date(),
    };

    console.log(JSON.stringify(data));

    try {
      const [updated] = await db.product_mains.update(data, {
        where: {
          id: id,
        },
      });
      if (updated) {
        //const updateSlip = await db.coin_transactions.findByPk(id);
        res.status(200).json({ message: "Completed." });
      } else {
        throw new Error("Transaction not found!");
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
}

module.exports = router;
