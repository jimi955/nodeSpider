//详情见句子迷爬虫

const getApi = require("../api/fetch").getApi;
const request = require("request");

// var targetOptions = {
//     method: 'GET',
//     url: 'http://ip.chinaz.com/getip.aspx',
//     timeout: 8000,
//     encoding: null,
// };


// const test_ip = async (proxyurl) => {
//
//     console.log(`testing ${proxyurl}`);
//     targetOptions.proxy = 'http://' + proxyurl;
//     request(targetOptions, function (error, response, body) {
//         try {
//             if (error) throw error;
//
//
//             body = body.toString();
//
//             console.log(body);
//
//             eval(`var ret = ${body}`);
//
//
//             if (ret) {
//                 console.log(`验证成功==>> ${ret.address}`);
//             }
//         } catch (e) {
//             // console.error(e);
//         }
//     });
// }
// (async () => {
//     await test_ip("49.84.33.229:4203")
// })();


const requestSync = (option) => {
    return new Promise((resolve, reject) => {
        request(option, (err, res) => {
            if (err) {
                console.log(err)
                return reject("request failed");
            }
            console.log("request success");
            return resolve(res.body);
        })
    })
};

const proxyGet = async (href, proxy) => {
    try {
        let proxy_url = proxy.ip + ":" + proxy.port;
        let option = {
            // url: "http://ip.chinaz.com/getip.aspx",
            url: href,
            proxy: "http://" + proxy_url,
            headers: {
                "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/70.0.3538.77 Chrome/70.0.3538.77 Safari/537.36",
                // 'Content-Type': 'application/json',
                'Connection': 'keep-alive'
            }
        }
        let re = await requestSync(option)
        return re

    } catch (e) {
        console.log("请求失败：", e);
        return false
    }
}

exports.proxyGet = proxyGet;