const express = require("express");
const router = express.Router();

const { contentsController } = require("../controller");
const { fileUploadMiddleware } = require("../middlewares/s3fileupload");
const { fileDeleteMiddleware } = require("../middlewares/s3fileDelete");
// const { singleUpload } = require("../middlewares/s3fileupload")

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

// 게시판 정보 요청
router.get("/", contentsController.contentInfo.get);

// 게시글 수정 요청
// 사진도 수정?
router.put("/update", contentsController.contentUpdate.put);

// 게시글 검색 요청
router.post("/search", contentsController.contentSearch.post);

// 댓글 수정 요청
router.put("/comment/update", contentsController.commentUpdate.put);

// 게시글 작성 요청
// s3에 사진 저장할 때 사용합니다.
// router.use("/post", fileUploadMiddleware);
router.post("/post", singleUpload, contentsController.contentPost.post);

module.exports = router;
//router.post('/', upload.array('img'), contentController.postContent.post);