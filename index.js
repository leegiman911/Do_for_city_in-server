const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./models");
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
  })
);

app.post("/signin", (req, res) => {
  // 로그인 요청시 입력된 비밀번호를 헤싱합니다.
  let secret1 = "도시인화이팅";
  const hash = crypto.createHmac("sha1", secret1);
  hash.update(req.body.password);
  let passwordHashed = hash.digest("hex");

  db.Users.findOne({ where: { userId: req.body.userId } }).then((checkUser) => {
    if (checkUser) {
      if (checkUser.password === passwordHashed) {
        req.session.regenerate((err) => {
          if (err) {
            res.status(404).send("session 다시 만들기 실패");
          }
          const session_id = req.session;
          session_id.userId = checkUser.id;
          res.setHeader("Set-Cookie", session_id);
          res.status(201).send({ id: checkUser.id });
        });
      } else {
        res.status(404).send("비밀번호가 틀렸습니다.");
      }
    } else {
      res.status(404).send("유저아이디가 틀렸습니다. o 없는 정보입니다.");
    }
  });
});

app.post("/signup", (req, res) => {
  db.Users.findOne({ where: { userId: req.body.userId } }).then(
    (checkUserId) => {
      if (!checkUserId) {
        db.Users.create({
          userId: req.body.userId,
          password: req.body.password,
          email: req.body.email,
        }).then((result) => res.status(201).send(result));
      } else {
        res
          .status(404)
          .send(
            "잘못된 회원가입 정보를 입력했거나, 이미 있는 유저아이디 입니다."
          );
      }
    }
  );
});

// 404코드 처리는 이후에 진행합니다.
//404코드 보내는 미들웨어
// app.use(function (req, res, next) {
//   res.sendStatus(404);
// });

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
