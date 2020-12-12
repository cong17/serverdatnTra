
const request = require("request")
require('https').globalAgent.options.rejectUnauthorized = false;
const cheerio = require('cheerio');
const covidData = require('./covid-19');
const fs = require('fs');


let getDataCovid = () => {
    return new Promise(async (resolve, reject) => {
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(body)
                //vietnam
                try {
                    let TitleVN = $("section.container div.form-row > div.col-lg-2.col-md-2.col-12.mb-1 ").text().trim();
                    let SoCaNhiemVN = $("section.container div.form-row > div.col-lg-2.col-md-2.col-6.text-center.text-uppercase.text-danger-new.mb-1 ").text().trim();
                    let DangDieuTriVN = $("section.container div.form-row > div.col-lg-2.col-md-2.col-6.text-center.text-uppercase.text-warning1.mb-1").text().trim()
                    let KhoiVN = $("section.container div.form-row > div.col-lg-2.col-md-2.col-6.text-center.text-uppercase.text-success.mb-1").text().trim();
                    let TuVongVN = $("section.container div.form-row > div.col-lg-2.col-md-2.col-6.text-center.text-uppercase.text-danger-new1.mb-1").text().trim();
                    let TitleWorld = $("section.container > div.row.d-none.d-block.d-lg-none > div > div.row > div.col-lg-2.col-md-2.col-12.mb-1").text().trim();
                    let SoCaNhiemWorld = $("section.container > div.row.d-none.d-block.d-lg-none > div > div.row > div.col-lg-2.col-md-2.col-6.text-center.text-uppercase.text-danger-new.mb-1").text().trim();
                    let DangDieuTriWorld = $("section.container > div.row.d-none.d-block.d-lg-none > div > div.row > div.col-lg-2.col-md-2.col-6.text-center.text-uppercase.text-warning1.mb-1").text().trim()
                    let KhoiWorld = $("section.container > div.row.d-none.d-block.d-lg-none > div > div.row > div.col-lg-2.col-md-2.col-6.text-center.text-uppercase.text-success.mb-1").text().trim();
                    let TuVongWorld = $("section.container > div.row.d-none.d-block.d-lg-none > div > div.row > div.col-lg-2.col-md-2.col-6.text-center.text-uppercase.text-danger-new1.mb-1").text().trim();
                    let date = new Date(); // Or the date you'd like converted.
                    let isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
                    const dataCovid = {
                        "VN": {
                            TitleVN: TitleVN,
                            SoCaNhiemVN: SoCaNhiemVN,
                            DangDieuTriVN: DangDieuTriVN,
                            KhoiVN: KhoiVN,
                            TuVongVN: TuVongVN


                        },
                        "World": {
                            TitleWorld: TitleWorld,
                            SoCaNhiemWorld: SoCaNhiemWorld,
                            DangDieuTriWorld: DangDieuTriWorld,
                            KhoiWorld: KhoiWorld,
                            TuVongWorld: TuVongWorld


                        },
                        "TimeUpdate": isoDateTime
                    }

                    try {
                        covidData.unshift(dataCovid);
                        fs.writeFileSync('./covid-19.json', JSON.stringify(covidData));
                    }
                    catch (error) {
                        reject(301)
                    }
                    resolve(200);
                }
                catch (err) {
                    reject(300)
                }

            }
        }
        let headers = {

            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        }

        let options = {
            url: 'https://ncov.moh.gov.vn/',
            headers: headers
        };
        request(options, callback);


    })

};
let getDataNews = () => {
    return new Promise(async (resolve, reject) => {
        let headers = {
            'authority': 'www.24h.com.vn',
            'cache-control': 'max-age=0',
            'upgrade-insecure-requests': '1',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'sec-fetch-site': 'none',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'cookie': '3f470794b0541edfa72ccf83d8c9a0f2=1; profile24hUid=98d0c7340a33cd3bd41c100562f8edff'
        };

        var options = {
            url: 'https://www.24h.com.vn/du-bao-thoi-tiet-c568.html',
            headers: headers
        };

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                const $ = cheerio.load(body)
                let chisokhongkhi = [];
                $("#cated > div > section > section > div > div").each(function (index) {
                    if (index < $("#cated > div > section > section > div > div").length - 1) {
                        let diadiem = $(this).find(".add").text().trim();
                        let chiso = $(this).find(".number").text().trim();
                        let obj = {
                            "diadiem": diadiem,
                            "chiso": chiso
                        }
                        chisokhongkhi.unshift(obj);
                    }

                });

                let cacbaibao = [];
                $("article.bxDoiSbIt").each(function (index) {
                    let text = $(this).find("header").text().trim();
                    if (text) {
                        let linkbaiviet = $(this).find("header a").attr("href");
                        let imgbaiviet = $(this).find("span.imgFlt.imgNws > a > img").attr("src");
                        let contentbaiviet = $(this).find("span.nwsSp ").text().trim();
                        let timebaiviet = $(this).find("span.nwsTit > .dated ").text().trim();
                        let obj = {
                            "linkbaiviet": linkbaiviet,
                            "imgbaiviet": imgbaiviet,
                            "contentbaiviet": contentbaiviet,
                            "timebaiviet": timebaiviet,
                        }
                        cacbaibao.unshift(obj);
                    }

                })
                let date = new Date(); // Or the date you'd like converted.
                let isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString()
                let objC = {
                    "chisokhongkhi": chisokhongkhi,
                    "cacbaibao": cacbaibao,
                    "TimeUpdate": isoDateTime
                }
                fs.readFile('./weather.json', function (err, data) {
                    if (err) {
                        reject("LOI KHI GET VAO DB")
                    }
                    let objectR = JSON.parse(data);
                    objectR.unshift(objC);
                    fs.writeFileSync('./weather.json', JSON.stringify(objectR));
                    resolve(200);
                });
            }
        }

        request(options, callback);


    })

};
module.exports = {
    getDataCovid: getDataCovid,
    getDataNews: getDataNews

};



