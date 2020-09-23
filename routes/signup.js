const express = require("express");
const router = express.Router();

const { signupController } = require("../controller");

// 회원가입 요청
router.post("/", signupController.signup.post);

// 회원가입 아이디 중복 확인 요청
router.post("/checkid", signupController.checkid.post);

module.exports = router;
