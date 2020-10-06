const express = require("express");
const router = express.Router();

const { othersController } = require("../controller");

// 로그인 요청
router.post("/signin", othersController.signin.post);

// 로그아웃 요청
router.post("/signout", othersController.signout.post);

// 댓글 작성 요청
router.post("/comments", othersController.commentPost.post);

// 게시글 정보 요청 (게시글 상세 페이지)
router.post("/contentDetail", othersController.contentDetail.post);

module.exports = router;
