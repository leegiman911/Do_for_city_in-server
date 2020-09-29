const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = 5000;


const signupRouter = require("./routes/signup");
const contentsRouter = require("./routes/contents");
const mypageRouter = require("./routes/mypage");
const othersRouter = require("./routes/others");

app.use(bodyParser.json());
app.use(cors());
app.use(
  cors({
    allowedHeaders: "*",
    method: ["GET", "POST", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(
  session({
    secret: "dosiin",
    resave: false,
    saveUninitialized: true,
  })
);

app.options("/signup", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  res.send();
});

app.use("/signup", signupRouter);
app.use("/contents", contentsRouter);
app.use("/mypage", mypageRouter);
app.use("/", othersRouter);

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
