const db = require("../../models");

module.exports = {
  // 마이페이지에서 내가 쓴 게시글로 이동 요청
  post: (req, res) => {
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
  },
};
