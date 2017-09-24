const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req,res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/subscribe', (req,res) => {
  if(
    req.body.captcha === undefined ||
    req.body.captcha === '' ||
    req.body.captcha === null
  ){
    return res.json({"success": false, "msg":"Please select captcha"});
  }

  // Secret key
  const secretKey = '6LfD4jEUAAAAAF4Dd83latJiN7ZvYVGhBFjg1lmm';

  // Verify url
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}&remoteip=${req.connection.remoteAddress}`;

  // Make request to verifyurl
  request(verifyUrl, (err,response,body) => {
    body = JSON.parse(body);
    console.log(body);

    // If not successful
    if(body.success !== undefined && !body.success){
      return res.json({"success": false, "msg":"Failed captcha verification"});
    }

    // If successful
    return res.json({"success": true, "msg":"Captcha passed"});
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
})
