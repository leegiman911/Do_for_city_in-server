const db = require("../../models");

module.exports = {
  // 게시글 작성 요청
  post: (req, res) => {
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
  },
};
