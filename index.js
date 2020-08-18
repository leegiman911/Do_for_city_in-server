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
          res.status(201).send({ id: checkUser.id });
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
      res.status(200).send(AllContents);
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
        {
          model: db.Comments,
          as: "comments",
          attributes: ["comment", "fk_contentId"],
        },
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

// 게시글 작성 요청
app.post("/contents/post", (req, res) => {
  if (req.session.session_id) {
    db.Contents.create({
      title: req.body.title,
      content: req.body.content,
      fk_userId: req.session.session_id,
    }).then((post) => {
      if (post) {
        res.status(200).send(post);
      }
    });
  } else {
    res.status(404).send("잘못된 요청입니다 확인후 시도해주시기 바랍니다.");
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
      attributes: ["title", "content", "createdAt", "id"],
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
    res.status(404).send("잘못 요청하셨습니다.");
  }
});

// 로그아웃 요청
app.post("/signout", (req, res) => {
  req.session.destroy();
  res.status(200).send("로그아웃 되셨습니다.");
});

// 회원정보 수정 요청
app.put("/mypage/setup", (req, res) => {
  if (req.session.session_id) {
    db.Users.update(
      {
        userId: req.body.userId,
        password: req.body.password,
        email: req.body.email,
      },
      { where: { id: req.session.session_id } }
    ).then((modified) => {
      res.status(201).send(modified);
    });
  } else {
    res.status(404).send("잘못 요청하셨습니다. 다시 시도해 주시기 바랍니다.");
  }
});

// 회원정보 수정을 위한 마이페이지 요청
app.get("/mypage/setup", (req, res) => {
  if (req.session.session_id) {
    db.Users.findOne({ where: { id: req.session.session_id } }).then(
      (userData) => {
        if (userData) {
          res.status(200).send(userData);
        }
      }
    );
  } else {
    res.status(404).send("잘못된 요청입니다. 다시 시도해 주시기 바랍니다.");
  }
});

// 회원 탈퇴 요청
app.patch("/mypage/leave", (req, res) => {
  const deleted = "deleted";
  if (req.session.session_id) {
    db.Users.findOne({ where: { id: req.session.session_id } }).then(
      (userData) => {
        db.Users.update(
          {
            userId: deleted,
            email: userData.email,
            password: userData.password,
          },
          { where: { id: req.session.session_id } }
        ).then((result) => {
          req.session.destroy();
          res.status(200).send(result);
        });
      }
    );
  } else {
    res.status(404).send("잘못된 요청입니다. 다시 시도해 주시기 바랍니다.");
  }
});

// 댓글 수정 요청 (게시판 상세 페이지)
app.put("/contents/comment/update", (req, res) => {
  // 해당 댓글을 수정 (클라이언트가 선택한) 작성자와 작성시간을 기준으로 잡는다.
  if (req.session.session_id) {
    db.Users.findOne({ where: { id: req.session.session_id } }).then(
      (userData) => {
        if (userData.userId === req.body.userId) {
          db.Comments.findOne({
            where: { fk_userId: userData.id, createdAt: req.body.createdAt },
          }).then((commentData) => {
            db.Comments.update(
              { comment: req.body.comment },
              { where: { id: commentData.id } }
            ).then((result) => {
              res.status(200).send(result);
            });
          });
        } else {
          res.status(404).send("잘못된 요청입니다.");
        }
      }
    );
  }
});

// 댓글 작성 요청
app.post("/comments", (req, res) => {
  // 해당 게시글에 대한 댓글을 작성
  // 해당 게시글에 대한 정보로 req.body에 해당 게시글의 title과 createdAt으로 받는다.
  if (req.session.session_id) {
    db.Contents.findOne({
      where: { title: req.body.title, createdAt: req.body.createdAt },
    }).then((contentData) => {
      console.log(contentData);
      db.Comments.create({
        comment: req.body.comment,
        fk_userId: req.session.session_id,
        fk_contentId: contentData.id,
      }).then((result) => res.status(201).send(result));
    });
  } else {
    res.status(404).send("잘못된 요청입니다.");
  }
});

// 마이페이지에서 내가 쓴 게시글로 이동 요청
app.post("/mypage/toContent", (req, res) => {
  if (req.session.session_id) {
    // 클라이언트 측에서 body에 해당 게시글의 title를 담아서 요청을 보낼 것이다.
    db.Contents.findAll({
      where: {
        title: req.body.title,
        fk_userId: req.session.session_id,
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
    }).then((content) => {
      res.status(201).send(content);
    });
  } else {
    res.status(404).send("요청하신 정보가 없습니다.");
  }
});

// 마이페이지에서 내가 쓴 댓글이 해당하는 게시글로 이동 요청
app.post("/mypage/toComment", (req, res) => {
  if (req.session.session_id) {
    // 클라이언트 측에서 body에 해당 댓글의 comment와 fk_contentId를 담아서 요청을 보낼 것이다.
    db.Contents.findAll({
      where: {
        id: req.body.fk_contentId,
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
    }).then((content) => {
      res.status(201).send(content);
    });
  } else {
    res.status(404).send("요청하신 정보가 없습니다.");
  }
});

// 게시글 수정 요청
app.put("/contents/update", (req, res) => {
  // 클라이언트 측에서 body에 수정을 요청하는 해당 게시글의 id와 변경된 title과 content를 담아서 요청을 보낼 것이다.
  if (req.session.session_id) {
    db.Contents.findOne({
      where: { id: req.body.id },
    }).then((contentData) => {
      if (contentData.fk_userId === req.session.session_id) {
        db.Contents.update(
          { title: req.body.title, content: req.body.content },
          { where: { id: contentData.id } }
        ).then((result) => {
          res.status(201).send(result);
        });
      } else {
        res.status(404).send("해당 게시글에 권한이 없습니다.");
      }
    });
  } else {
    res.status(404).send("잘못된 요청입니다.");
  }
});

// 게시글 검색 api
app.get("/contents/search", (req, res) => {
  if(req.session.session_id){
    db.Contents.findAll({
      where: {
        title: req.body.title
      }}).then((titles) => {
        if(titles){
          {
            // 클라이언트 측에서 body에 title과 createdAt를 같이 담아서 GET요청을 보낼 것이다.
            db.Contents.findAll({
              where: {
                title: req.body.title,
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
                res.status(200).send(contentDetail)})
          } 
        }
      })
}
})

app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
