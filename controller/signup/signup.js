const db = require("../../models");

// 회원가입 요청
module.exports = {
  post: (req, res) => {
    db.Users.findOne({ where: { userId: req.body.userId } }).then(
      (checkUserId) => {
        if (!checkUserId) {
          db.Users.create({
            userId: req.body.userId,
            password: req.body.password,
            email: req.body.email,
          }).then((result) => res.status(201).send(result));
        } else {
          res.status(404).send("잘못된 요청입니다. 다시 입력해주세요");
        }
      }
    );
  },
};
