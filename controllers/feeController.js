const express = require("express");
const router = express.Router();
const db = require("../models");
const authorization = require("../config/authorize");

router.get("/fee", authorization, async (_, res) => {
  try {
    const result = await db.coin_fees.findOne({
        attributes: ['fee']
    });
    res.status(200).json({ fee: result });
  } catch (error) {
    res.status(500).json({ errMsg: error.message });
  }
});

module.exports = router;
