const db = require("../../models");

module.exports = {
  // 게시글 정보 API (게시글 상세 페이지)
  post: (req, res) => {
    if (req.session.session_id) {
      // 클라이언트 측에서 body의 data에(axios get요청) title과 createdAt를 같이 담아서 POST요청을 보낼 것이다.
      db.Contents.findAll({
        where: {
          title: req.body.title,
          createdAt: req.body.createdAt,
        },
        attributes: ["title", "content", "referenceFile", "createdAt", "id"],
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
  },
};
