const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const e = require("express");
const { Users } = require("./models");
const crypto = require("crypto");

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

app.use(
  session({
    secret: "dosiin",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

app.post("/signin", async (req, res) => {
  // console.log("암호화전", req.body.password);
  let secret1 = "도시인화이팅";
  const hash = crypto.createHmac("sha1", secret1);
  hash.update(req.body.password);
  let passwordHashed = hash.digest("hex");
  // console.log("암호화후", passwordHashed);

  let checkUser = await Users.findOne({ where: { userId: req.body.userId } });
  if (checkUser) {
    if (checkUser.password === passwordHashed) {
      // console.log("이건 무엇일까요????? 111", req.session);
      req.session.regenerate((err) => {
        if (err) {
          res.status(404).send("session 다시 만들기 실패");
        }
        const session_id = req.session;
        // console.log("session_id????이건?", session_id);
        session_id.userId = checkUser.id;
        // console.log("session_id.userId", session_id.userId);
        res.setHeader("Set-Cookie", session_id);
        res.status(200).send({ id: checkUser.id });
      });
    } else {
      res.status(404).send("비밀번호가 틀렸습니다.");
    }
  } else {
    res.status(404).send("유저아이디가 틀렸습니다. o 없는 정보입니다.");
  }
});

app.post("/signup", async (req, res) => {
  let checkUserId = await Users.findOne({ where: { userId: req.body.userId } });
  if (!checkUserId) {
    Users.create({
      userId: req.body.userId,
      password: req.body.password,
      email: req.body.email,
    }).then((result) => res.status(201).send(result));
  } else {
    // console.log("무엇?", req.body);
    res
      .status(404)
      .send("잘못된 회원가입 정보를 입력했거나, 이미 있는 유저아이디 입니다.");
  }
});

//404코드 보내는 미들웨어
// app.use(function (req, res, next) {
//   res.sendStatus(404);
// });

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
