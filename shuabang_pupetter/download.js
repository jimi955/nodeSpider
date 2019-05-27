var fs = require('fs')
var path = require('path')
const readFile = require("../apiofxx/readFile").readFile;
const Queue = require("../api/queue").Queue;
const dirname = './download'
const request = require("request");
const initProxy = async () => {
    let ds = await readFile("ip_pool.txt")
    proxy = ds.pop()
    console.log("注意××××××××####### 换新的ip啦")
    console.log("注意××××××××####### 换新的ip啦")
    console.log(proxy)
}
let proxy;
const mkdirSync = async (dirname) => {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirSync(path.dirname(dirname))) {  //path.dirname(dirname):dirname的上一级路径
            fs.mkdirSync(dirname);
            return true;
        }
    }
    return false
}
const sleep = (s = 5) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000))
};
const downloadUrl = async (urlList, k) => {
    let proxy_url = proxy.ip + ":" + proxy.port;

    for (const url of urlList) {
        let options = {
            url: url,
            proxy: "http://" + proxy_url
        }
        let dstpath = dirname + "/" + "liaodian" + k + ".apk";
        if (mkdirSync(dirname)) {
            await request(options).pipe(fs.createWriteStream(dstpath))
        }
    }
}

let urllist = ["http://app.mi.com/download/618296?ref=search"];
(async () => {
    let i = 1;
    while (true) {
        try {
            await initProxy();
            await downloadUrl(urllist, i);
            let time = new Date();
            let obj = {i, time};
            await Queue.postDataToMessage("shuabang_xiaomi_liaodian_download", JSON.stringify(obj));
            console.log("当前下载量：", i)
            await sleep(90)
        } catch (e) {
        }
        i += 1;

    }
})()

