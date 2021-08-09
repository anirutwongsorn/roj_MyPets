const express = require("express");
const router = express.Router();
const db = require("../models");
// const moment = require("moment-timezone");

router.get("/slider/homeslider", async (_, res) => {
  try {
    const result = await db.homesliders.findAll({
      attributes: ["id", "image"],
    });

    // var thaiDate = moment().tz("Asia/Bangkok").format();
    // console.log(thaiDate);

    res.status(200).json({ slider: result });
  } catch (error) {
    res.status(500).json({ errMsg: error.message });
  }
});

module.exports = router;
