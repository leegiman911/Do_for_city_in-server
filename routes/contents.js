const express = require("express");
const router = express.Router();

const { contentsController } = require("../controller");

// 게시판 정보 요청
router.get("/", contentsController.contentInfo.get);

// 게시글 수정 요청
router.put("/update", contentsController.contentUpdate.put);

// 게시글 검색 요청
router.get("/search", contentsController.contentSearch.get);

// 댓글 수정 요청
router.put("/comment/update", contentsController.commentUpdate.put);

// 게시글 작성 요청
router.post("/post", contentsController.contentPost.post);

module.exports = router;
