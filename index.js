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

app.options("/signup", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Length, X-Requested-With"
  );
  res.send();
});

// 로그인 요청
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

// 회원가입 요청
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
        res.status(404).send("잘못된 요청입니다. 다시 입력해주세요");
      }
    }
  );
});
// 회원가입 아이디 중복확인 요청
app.post("/signup/checkid", (req, res) => {
  db.Users.findOne({ where: { userId: req.body.userId } }).then((checkId) => {
    if (checkId) {
      res.status(404).send("이미 존재하는 유저아이디 입니다");
    } else {
      res.status(200).send("사용가능한 아이디 입니다.");
    }
  });
});

// 게시판 정보 요청
app.get("/Contents", (req, res) => {
  const { title, content, referenceFile } = req.body;
  db.Contents.findAll({
    where: { title: title, content: content, referenceFile: referenceFile },
  }).then((Content) => {
    if (Content) {
      res.status(200).json(Content);
    } else {
      res.status(404).send("잘못된 경로입니다 확인후 시도해주시기 바랍니다.");
    }
  });
});

// 게시글 작성 요청 // 작성중
// app.post("/contents/post", (req, res) => {
//   console.log(req.body);
//   console.log(req.session);

//   res.status(404).send("test중");
//   // db.Contents.create({
//   //   title: req.body.title,
//   //   content: req.body.conten,
//   //   referenceFile: req.body.referenceFile,
//   // });
// });

// 404코드 처리는 이후에 진행합니다.
//404코드 보내는 미들웨어
// app.use(function (req, res, next) {
//   res.sendStatus(404);
// });

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
