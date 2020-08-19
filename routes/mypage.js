const express = require("express");
const router = express.Router();

const { mypageController } = require("../controller");

// 회원정보 마이페이지 요청
router.get("/", mypageController.mypageGet.get);

// 회원정보 수정 요청
router.put("/setup", mypageController.mypageSetupPut.put);

// 회원정보 수정을 위한 마이페이지 요청
router.get("/setup", mypageController.mypageSetupGet.get);

// 회원탈퇴 요청
router.patch("/leave", mypageController.mypageLeave.patch);

// 마이페이지에서 내가 쓴 게시글로 이동 요청
router.post("/toContent", mypageController.mypageToContent.post);

// 마이페이지에서 내가 쓴 댓글로 이동 요청
router.post("/toComment", mypageController.mypageToComment.post);

module.exports = router;
