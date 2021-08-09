const express = require("express");
const router = express.Router();
const db = require("../models");
const authorization = require("../config/authorize");

router.get("/memberLevel/:id", authorization, async (req, res) => {
  const id = req.params.id;
  try {
    let sql =
      'SELECT "userid", "subid", "fname", "lname", "memnum", "level" FROM "TeamLevels" JOIN "Members" ON "TeamLevels"."subid" = "Members"."id" WHERE "TeamLevels"."userid"=(:id) ';
    var result = await db.sequelize.query(sql, {
      replacements: { id: id },
      type: db.sequelize.QueryTypes.SELECT,
    });
    res.status(200).json({ member: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/memberProfit/:id", authorization, async (req, res) => {
  const id = req.params.id;
  try {
    var sql =
      'SELECT "userid", "fname", "lname", "mm", "yy", SUM("profit") as profit FROM "Profits" JOIN "Members" ON "Profits"."userid" = "Members"."id" WHERE "userid"=(:id) GROUP BY "userid", "fname", "lname", "mm", "yy" ';
    var profit = await db.sequelize.query(sql, {
      replacements: { id: id },
      type: db.sequelize.QueryTypes.SELECT,
    });

    var profitRec = await db.ProfitRecommended.findAll({
      where: { userid: id },
      attributes: ["userid", "lv1", "lv2", "lv3"],
    });

    res.status(200).json({ profit: profit, profitRec: profitRec });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
