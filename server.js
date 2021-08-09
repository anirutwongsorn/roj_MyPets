require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const corsOption = {
  origin: ["http://localhost:4200"],
  optionsSuccessStatus: 200,
};

//====middle ware=====
app.use("/images", express.static("images"));
app.use(cors(corsOption));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api", require("./controllers/accountController"));
app.use("/api", require("./controllers/memberController"));
app.use("/api", require("./controllers/feeController"));
app.use("/api", require("./controllers/productController"));
app.use("/api", require("./controllers/adminController"));
// app.use("/api", require("./controllers/memberController"));
// app.use("/api", require("./controllers/salesController"));
app.use("/api", require("./controllers/home_slider"));
// app.use("/api", require("./controllers/accountController"));
// app.use("/api", require("./controllers/memberLevelController"));


const PORT = process.env.PORT || 1150;
app.listen(PORT, () => {
  const env = process.env.NODE_ENV || "Development";
  console.log("App listening on port " + PORT);
  console.log("App listening on env " + env);
  console.log("Press Ctrl+C to quit.");
});
