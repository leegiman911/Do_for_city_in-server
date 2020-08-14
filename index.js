const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

app.post("/signup", (req, res) => {
  //req.body에 정보 있음!
  //회원 가입 정보 db로 보내주세요!

  res.sendStatus(201);
});


//404코드 보내는 미들웨어
app.use(function (req, res, next) {
  res.sendStatus(404);
});



app.listen(PORT, () => {
  console.log(`server on ${PORT}`);
});
