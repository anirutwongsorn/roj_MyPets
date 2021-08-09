const express = require("express");
const router = express.Router();
const multer = require("multer");
const multerConfig = require("../config/multer_config");
const upload = multer(multerConfig.config).single(multerConfig.keyUploadPhoto);
const db = require("../models");
const authorization = require("../config/authorize");


//========Get bill with main========
router.get("/billmain/:username", authorization, async (req, res) => {
  try {
    const result = await db.BillHeaders.findAll({
      where: { username: req.params.username },
    });
    res.status(200).json({ BillHeaders: result });
  } catch (error) {
    res.status(500).json({ errMsg: error.message });
  }
});

//========Get bill with details========
router.get("/billmain/getdetails/:billcd", authorization, async (req, res) => {
  try {
    const billHeader = await db.BillHeaders.findAll({
      where: { billcd: req.params.billcd },
    });

    const billWo = await db.BillWos.findAll({
      where: { billcd: req.params.billcd },
    });

    res.status(200).json({ billHeader: billHeader, billWo: billWo });
  } catch (error) {
    res.status(500).json({ errMsg: error.message });
  }
});

//===========POST Add bil main====================
router.post("/billmain", authorization, async (req, res) => {
  //=====check guid======
  console.log(`guid : ${req.body.guid}`);
  const _guid = req.body.guid;
  const chkBill = await db.BillHeaders.findOne({
    where: { guid: _guid },
  });
  if (chkBill) {
    const data = {
      ...req.body,
      billcd: chkBill.billcd,
    };
    var billWo = await db.BillWos.create(data);
    return res.status(200).json({ BillWos: billWo });
  }

  //=====get max bill=====
  const nextBill = (await db.BillHeaders.count()) + 1;
  const billDt = formatDate();
  const data = {
    ...req.body,
    imgRef: "",
    billcd: `${billDt}-${nextBill}`,
  };
  console.log(data);
  try {
    const billheader = await db.BillHeaders.create(data);
    const billWo = await db.BillWos.create(data);
    res.status(200).json({ billheader: billheader, billWo: billWo });
  } catch (err) {
    res.status(500).json({ errMsg: err.message });
  }
});

//============PUT Upload slip============
router.put("/billmain/uploadPaySlip/:billcd", authorization, (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log("error: " + JSON.stringify(err));
      return res.status(500).json({ errMsg: err.message });
    } else if (err) {
      console.log("error: " + JSON.stringify(err));
      return res.status(500).json({ errMsg: err.message });
    }

    try {
      const result = await db.BillHeaders.findOne({
        where: { billcd: req.params.billcd },
      });

      if (!result) {
        return res.status(404).json({ message: "Bill not found!" });
      }

      updateBillPaySlip(req, res, result);
    } catch (error) {
      res.status(500).json({ errMsg: error.message });
    }
  });
});

function updateBillPaySlip(req, res, billmain) {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.log("error: " + JSON.stringify(err));
      return res.status(500).json({ errMsg: err.message });
    } else if (err) {
      console.log("error: " + JSON.stringify(err));
      return res.status(500).json({ errMsg: err.message });
    }

    const data = {
      ...req.body,
      image: req.file ? req.file.filename : undefined,
    };

    try {
      const [updated] = await db.BillHeaders.update(data, {
        where: {
          id: billmain.id,
        },
      });
      if (updated) {
        res.status(200).json({ message: "Update success" });
      } else {
        throw new Error("Bill not found!");
      }
    } catch (err) {
      res.status(500).json({ errMsg: err.message });
    }
  });
}

//======function Format billCd========
function formatDate() {
  var d = new Date(),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("");
}

module.exports = router;
