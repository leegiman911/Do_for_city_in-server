const express = require("express");
const router = express.Router();

const { contentsController } = require("../controller");
const { fileUploadMiddleware } = require("../middlewares/s3fileupload");
const { fileDeleteMiddleware } = require("../middlewares/s3fileDelete");

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
router.use("/post", fileUploadMiddleware);
router.post("/post", contentsController.contentPost.post);

module.exports = router;
