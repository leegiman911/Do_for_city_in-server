const db = require("../../models");

module.exports = {
  // 댓글 작성 요청
  post: (req, res) => {
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
  },
};
