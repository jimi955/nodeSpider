var request = require('request')
var fs = require('fs')
var path = require('path')
const readFile = require("../apiofxx/readFile").readFile;

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
const downloadUrl = async (url, path, filename) => {
    let name = url.split(".")
    name = "." + name[name.length - 1]
    let dstpath = path + "/" + filename + name
    console.log("文件路径和名称：", dstpath)
    if (mkdirSync(path)) {
        await request(url).pipe(fs.createWriteStream(dstpath))
    }
}


// (async () => {
//     let urllist = ["https://wx3.sinaimg.cn/crop.0.0.1280.1280.1280/006l0itpgy1ff8mrzv0wcj30v90v979z.jpg"]
//     let path = __dirname
//     let name = 2
//     console.log(path)
//     await downloadUrl(urllist[0], path, name)
// })()

exports.downloadUrl = downloadUrl;