const db = require("../../models");
module.exports = {
  // 게시글 검색 요청
  // 클라이언트 측에서 body의 data에(axios get요청) title을 담아 GET요청
  post: (req, res) => {
    if (req.session.session_id) {
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
      })
        .then((contentDetail) => {
          res.status(200).send(contentDetail);
        })
        .catch((err) => console.log(err));
    } else {
      res.status(404).send("잘못된 요청입니다.");
    }
  },
};
