const db = require("../models");
const AWS = require("aws-sdk");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json"); // 이곳에 s3관련 개인정보 등록하기
let s3 = new AWS.S3();

module.exports = {
  fileDeleteMiddleware: async (req, res, next) => {
    const content = await db.Contents.findOne({
      where: {
        /* 해당 컨텐츠 찾기 */
      },
    });

    if (!content) {
      res.status(403).json({
        message: "잘못된 요청입니다.",
      });
    } else {
      if (!content.referenceFile) {
        console.log("기존 이미지 파일이 존재하지 않습니다.");
      } else {
        let key = content.referenceFile.substring(58);
        const params = { Bucket: "dosiin", Key: key };

        db.Contents.update(
          { referenceFile: null },
          {
            where: {
              /** 해당 컨텐츠 찾기 */
            },
          }
        );

        s3.deleteObject(params, (err, data) => {
          if (err) {
            return res.json({
              success: false,
              errors: {
                title: "Image Upload Error",
                detail: err.message,
                error: err,
              },
            });
          }
        });
      }
    }
    next();
  },
};
