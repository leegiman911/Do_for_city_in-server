const db = require("../../models");
module.exports = {
  // 게시글 수정 요청
  put: (req, res) => {
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
  },
};
