const db = require("../../models");
const crypto = require("crypto");

module.exports = {
  // 로그인 요청
  post: (req, res) => {
    // 로그인 요청시 입력된 비밀번호를 헤싱합니다.
    let secret1 = "도시인화이팅";
    const hash = crypto.createHmac("sha1", secret1);
    hash.update(req.body.password);
    let passwordHashed = hash.digest("hex");

    db.Users.findOne({ where: { userId: req.body.userId } }).then(
      (checkUser) => {
        if (checkUser) {
          if (checkUser.password === passwordHashed) {
            // session 객체에 유저 id 추가
            req.session.session_id = checkUser.id;
            // 해당 session을 저장, 보내주기
            if (req.session.session_id) {
              res.status(201).send({ id: checkUser.id });
            }
          } else {
            res.status(404).send("비밀번호가 틀렸습니다.");
          }
        } else {
          res.status(404).send("유저아이디가 틀렸습니다. o 없는 정보입니다.");
        }
      }
    );
  },
};
