const db = require("../../models");

module.exports = {
  // 회원정보 수정 요청
  put: (req, res) => {
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
  },
};
