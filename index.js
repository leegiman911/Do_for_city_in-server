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
        // session 객체에 유저 id 추가
        req.session.session_id = checkUser.id;
        // 해당 session을 저장, 보내주기
        if (req.session.session_id) {
          res.status(200).send({ id: checkUser.id });
        }
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
app.get("/contents", (req, res) => {
  db.Contents.findAll({
    attributes: ["title", "createdAt"],
    include: [
      {
        model: db.Users,
        as: "contents",
        attributes: ["userId"],
      },
    ],
  }).then((AllContents) => {
    if (AllContents) {
      res.status(200).json(AllContents);
    } else {
      res.status(404).send("잘못된 경로입니다 확인후 시도해주시기 바랍니다.");
    }
  });
});

// 회원정보 마이페이지 요청
app.get("/mypage", (req, res) => {
  // 저장된 세션아이디 확인
  if (req.session.session_id) {
    db.Users.findAll({
      where: { id: req.session.session_id },
      attributes: ["userId"],
      include: [
        { model: db.Contents, as: "contents", attributes: ["title"] },
        { model: db.Comments, as: "comments", attributes: ["comment"] },
      ],
    }).then((userInfo) => {
      if (userInfo) {
        res.status(200).send(userInfo);
      }
    });
  } else {
    res.status(404).send("잘못 요청하셨습니다.");
  }
});

// 게시글 정보 API (게시글 상세 페이지)
app.get("/contentDetail", (req, res) => {
  if (req.session.session_id) {
    // 클라이언트 측에서 body에 title과 createdAt를 같이 담아서 GET요청을 보낼 것이다.
    db.Contents.findAll({
      where: {
        title: req.body.title,
        createdAt: req.body.createdAt,
      },
      attributes: ["title", "content", "createdAt"],
      include: [
        { model: db.Users, as: "contents", attributes: ["userId"] },
        {
          model: db.Comments,
          as: "commentsContent",
          attributes: ["comment", "createdAt"],
          include: [
            { model: db.Users, as: "comments", attributes: ["userId"] },
          ],
        },
      ],
    }).then((contentDetail) => {
      if (contentDetail) {
        res.status(200).send(contentDetail);
      } else {
        res.status(404).send("요청하신 정보가 없습니다.");
      }
    });
  } else {
    res.status(400).send("잘못 요청하셨습니다.");
  }
});

// 404코드 처리는 이후에 진행합니다.
//404코드 보내는 미들웨어
// app.use(function (req, res, next) {
//   res.sendStatus(404);
// });

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
