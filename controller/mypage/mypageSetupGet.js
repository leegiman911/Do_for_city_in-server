const db = require("../../models");

module.exports = {
  // 회원정보 수정을 위한 마이페이지 요청
  get: (req, res) => {
    if (req.session.session_id) {
      db.Users.findOne({ where: { id: req.session.session_id } }).then(
        (userData) => {
          if (userData) {
            res.status(200).send(userData);
          }
        }
      );
    } else {
      res.status(404).send("잘못된 요청입니다. 다시 시도해 주시기 바랍니다.");
    }
  },
};
