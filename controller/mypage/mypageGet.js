const db = require("../../models");

module.exports = {
  // 회원정보 마이페이지 요청
  get: (req, res) => {
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
  },
};
