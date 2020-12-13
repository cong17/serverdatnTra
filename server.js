const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const cron = require('cron');
const { getDataCovid, getDataNews } = require("./crawlerCovid");
const fs = require('fs');
const corsHeader = (req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
};
// app.use(corsHeader);


const job = new cron.CronJob({
  cronTime: '*/10 * * * *', // Chạy Jobs vào moi 5p
  onTick: function () {
    getDataCovid();
    getDataNews();
    console.log('Bat dau load data');
  },
  start: true,
  timeZone: 'Asia/Ho_Chi_Minh' // Lưu ý set lại time zone cho đúng 
});

job.start();




app.get('/covid', async (req, res) => {
  fs.readFile('./covid-19.json', function (err, data) {
    if (err) {
      console.log(err)
      res.status(501).send("Something wrong");
    }
    let objectR = JSON.parse(data);
    objectR = objectR[0];
    res.status(200).send(objectR);
  });

});
app.get('/covidfull', async (req, res) => {
  fs.readFile('./covid-19.json', function (err, data) {
    if (err) {
      console.log(err)
      res.status(501).send("Something wrong");
    }
    let objectR = JSON.parse(data);
    res.status(200).send(objectR);
  });

});

app.get('/weather', async (req, res) => {
  fs.readFile('./weather.json', function (err, data) {
    if (err) {
      console.log(err)
      res.status(501).send("Something wrong");
    }
    let objectR = JSON.parse(data);
    objectR = objectR[0];
    res.status(200).send(objectR);
  });

});
app.get('/weatherfull', async (req, res) => {
  fs.readFile('./weather.json', function (err, data) {
    if (err) {
      console.log(err)
      res.status(501).send("Something wrong");
    }
    let objectR = JSON.parse(data);
    res.status(200).send(objectR);
  });

});



app.get('/', async (req, res) => {

  return res.send(
    `
  <a href="/covid"><h4>Lấy bản ghi covid gần nhất</h4></a>
  <a href="/covidfull"><h4>Lấy full bản ghi covid</h4></a>
  <a href="/weather"><h4>Lấy bản ghi thời tiết gần nhất</h4></a>
  <a href="/weatherfull"><h4>Lấy full bản ghi thời tiết</h4>
  </a> <h4>Write by Nguyen Thi Thu Tra K52KMT</h4>`
  );
});








app.listen(port, () => console.log(`Server Crawler ready ${port}!`));
