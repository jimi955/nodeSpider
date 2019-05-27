const http = require("http");
let Http = {};
const iconv = require("iconv-lite");

const timeout = 40000;
const suckPath = (str) => {
    let a = str.split("//")[1].split("/");
    let b = "";
    for (let i = 1; i < a.length; i++) {
        b = b + "/"+ a[i]
    }
    return b;
}

Http.call = async (path, args) => {
    let data = args || {};
    let postData = JSON.stringify(data);
    let s = suckPath(path)
    let options = {
        protocol: path.split(":")[0] + ":",
        host: path.split("//")[1].split("/")[0],
        // "/" + path.split("com/")[1],
        //port: "3000",
        method: "POST",
        path: s,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    return new Promise((resolve, reject) => {
        let req = http.request(options, (res) => {
            let data = "";
            res.setEncoding('utf-8');
            res.on("data", (chunk) => {
                data += chunk;
            })
            res.on("end", () => {
                resolve(data);
            })
        })

        req.setTimeout(timeout, () => {
            reject("timeout");
        })

        req.on("error", (e) => {
            console.log(e);
            reject(e);
        })

        req.write(postData);
        req.end();
    })
}
Http.get = async (path) => {
    let options = {
        protocol: path.split(":")[0] + ":",
        host: path.split("//")[1].split("/")[0],
        //port: "3000",
        method: "GET",
        path: "/" + path.split("com/")[1],
        headers: {
            'Content-Type': 'application/json',
        }
    };
    return new Promise((resolve, reject) => {

        let req = http.request(options, (res) => {
            let data = "";
            res.setEncoding('utf-8');
            res.on("data", (chunk) => {
                data += chunk;
            })
            res.on("end", () => {
                resolve(data);
            })
        })

        req.setTimeout(timeout, () => {
            reject("timeout")
        })

        req.on("error", (e) => {
            console.log(e);
            reject(e);
        })

        req.end();
    })
}

Http.proxyGet = async (path, proxy) => {
    let options = {
        host: proxy,
        port: "",
        method: "GET",
        path: path,
        headers: {
            'Content-Type': 'application/json',
        }
    }
    return new Promise((resolve, reject) => {

        let req = http.request(options, (res) => {
            let data = "";
            res.setEncoding('utf-8');
            res.on("data", (chunk) => {
                data += chunk;
            })
            res.on("end", () => {
                resolve(data);
            })
        })

        req.setTimeout(timeout, () => {
            reject("timeout")
        })

        req.on("error", (e) => {
            console.log(e);
            reject(e);
        })

        req.end();
    })
}

Http.GBKGet = (path) => {
    return new Promise((resolve, reject) => {
        request.get(href).pipe(iconv.decodeStream('gbk')).collect(function (err, body) {
            resolve(body)
        });
    })
}
exports.Http = Http;