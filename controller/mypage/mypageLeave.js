const db = require("../../models");

module.exports = {
  // 회원 탈퇴 요청
  patch: (req, res) => {
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
  },
};
