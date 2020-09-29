const path = require("path");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json"); // 이곳에 s3관련 개인정보 등록하기

let s3 = new AWS.S3();
let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "dosiin", // 이곳에 s3 버킷 이름을 작성한다.
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read-write", // 이렇게 설정해주어야 읽고 삭제하기가 가능하다.
    key: (req, file, cb) => {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
  }),
  // limits: { fileSize: 5 * 1024 * 1024 }, // 사진 용량제한두기
});
const singleUpload = upload.single("imgFile"); // 클라이언트 측에서 사진 className을 이렇게 설정해주기
module.exports = {
  fileUploadMiddleware: (req, res, next) => {
    singleUpload(req, res, function (err) {
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
      next();
    });
  },
};