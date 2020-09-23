const db = require("../../models");
module.exports = {
  // 댓글 수정 요청 (게시판 상세 페이지)
  put: (req, res) => {
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
  },
};
