const db = require("../../models");

// 게시판 정보 요청
module.exports = {
  get: (req, res) => {
    db.Contents.findAll({
      attributes: ["title", "referenceFile", "createdAt"],
      include: [
        {
          model: db.Users,
          as: "contents",
          attributes: ["userId"],
        },
      ],
    }).then((AllContents) => {
      if (AllContents) {
        res.status(200).send(AllContents);
      } else {
        res.status(404).send("잘못된 경로입니다 확인후 시도해주시기 바랍니다.");
      }
    });
  },
};
