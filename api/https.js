const http = require("https");
let Http = {};
let timeout = 10000

const suckPath = (str) => {
    let paths = []
    let protocol = str.split("//")[0]
    paths.push(protocol)
    let a = str.split("//")[1].split("/")
    let host = a.shift()
    paths.push(host)
    let path = "/" + a.join("/")
    paths.push(path)
    return paths
}

Http.call = async (path, args, moreArgs) => {
    let data = args || {};
    let more_args = moreArgs || {}
    let postData = JSON.stringify(data);
    // let postData = data;
    if (more_args.timeout) {
        var timeout = more_args.timeout
    } else {
        var timeout = 10000
    }
    let paths = suckPath(path)
    if (more_args.headers) {
        var options = {
            protocol: paths[0],
            host: paths[1],
            method: "POST",
            path: paths[2],
            headers: moreArgs.headers
        }
    } else {
        var options = {
            proticol: paths[0],
            host: paths[1],
            method: "POST",
            path: paths[2],
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }

    }
    // console.log(options)
    return new Promise((resolve, reject) => {

        let req = http.request(options, (res) => {

            let data = "";
            res.setEncoding('utf-8');
            res.on("data", (chunk) => {
                data += chunk;
            })
            res.on("end", () => {
                // console.log(res.headers.cookie)
                // console.log(req.headers.cookie)
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

        req.write(postData);
        req.end();
    })

}

Http.get = async (path, moreArgs) => {
    let more_args = moreArgs || {}
    if (more_args.timeout) {
        var timeout = more_args.timeout
    } else {
        var timeout = 10000
    }
    let paths = suckPath(path)
    if (more_args.headers) {
        var options = {
            proticol: paths[0],
            host: paths[1],
            method: "GET",
            path: paths[2],
            headers: moreArgs.headers
        }
    } else {
        var options = {
            proticol: paths[0],
            host: paths[1],
            method: "GET",
            path: paths[2],
            headers: {
                'Content-Type': 'application/json',
            }
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

Http.proxyGet = async (path, proxy, moreArgs) => {
    let ip = proxy.ip;
    let port = proxy.port;
    let more_args = moreArgs || {}
    if (more_args.timeout) {
        var timeout = more_args.timeout
    } else {
        var timeout = 10000
    }
    // let paths = suckPath(path)
    if (more_args.headers) {
        var options = {
            host: ip,
            port: port,
            method: "GET",
            path: path,
            headers: moreArgs.headers
        }
    } else {
        var options = {
            host: ip,
            port: port,
            method: "GET",
            path: path,
            headers: {
                'Content-Type': 'application/json',
            }
        }
    }
    console.log(options)
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


exports.Http = Http;