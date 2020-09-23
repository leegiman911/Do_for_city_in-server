const db = require("../../models");

// 회원가입 아이디 중복확인 요청
module.exports = {
  post: (req, res) => {
    db.Users.findOne({ where: { userId: req.body.userId } }).then((checkId) => {
      if (checkId) {
        res.status(404).send("이미 존재하는 유저아이디 입니다");
      } else {
        res.status(200).send("사용가능한 아이디 입니다.");
      }
    });
  },
};
