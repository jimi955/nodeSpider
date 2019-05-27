const Http = require("../../Core/http");
const File = require("../../Core/file");
const readLine = require('lei-stream').readLine;
const Crypto = require("../../Core/crypto");
const qiniu = require("qiniu");


var companyAccessKey = 'gXjmrs0RzsZCgCgXyFeG4rJOFF7PeyRJoA5utl1F';
var companySecretKey = 'B0hqBH81VnWEZnY9VC_nikn9tfos89su0wbrJpDo';

const downloadImage = async (url) => {
    let downloadTimeout = 60000;
    let downloadHeaders = {
        "User-Agent": "Dalvik/2.1.0 (Linux; U; Android 6.0; Redmi Note 4 MIUI/7.6.10)"
    };
    let res = await Http.request(url, "GET", null, downloadHeaders, true, true, downloadTimeout);
    let contentType = res.headers["content-type"];
    if (contentType && contentType.indexOf("image/") !== 0) throw new Error(`url(${url} is not image`);
    return res.body;
};

const uploadImageWashu = async (buffer) => {
    let filename = "duitang/" + Crypto.md5sum(buffer) + ".png";
    return new Promise((resolve, reject) => {
        let mac = new qiniu.auth.digest.Mac(companyAccessKey, companySecretKey);
        let options = {
            scope: 'image:' + filename
        };
        let putPolicy = new qiniu.rs.PutPolicy(options);
        let uploadToken = putPolicy.uploadToken(mac);
        let config = new qiniu.conf.Config();
        config.zone = qiniu.zone.Zone_z0;
        let formUploader = new qiniu.form_up.FormUploader(config);
        let putExtra = new qiniu.form_up.PutExtra();
        formUploader.put(uploadToken, filename, buffer, putExtra, (err, respBody, respInfo) => {
            if (err) return reject(err);
            if (respInfo.statusCode != 200) return reject(new Error("upload failed, status = " + respInfo.statusCode + ", data = " + JSON.stringify(respBody)));
            let resUrl = respBody.key;
            return resolve(resUrl);
        });
    });
};

// let count = 0;
// async function uploadImages() {
//     readLine('/media/chen/SOFTWARE/work_dir/topgif/namescd.txt').go(async function (data, next) {
//         count+=1;
//         if (data !== ""){
//             try{
//                 let model = JSON.parse(data);
//                 let buffer = await downloadImage(model.url);
//                 let resUrl = await uploadImageWashu(buffer);
//                 let newModel = {key: name, url: "https://image.jndroid.com/" + resUrl};
//                 File.appendFileSync('/media/chen/SOFTWARE/work_dir/topgif/res_gif.txt', JSON.stringify(newModel) + "\n");
//             } catch (err) {
//                 console.log(err);
//             }
//         }
//         next();
//     }, function () {
//         console.log('================  image water mark read end  ===============');
//     });
// }
//
//
// uploadImages();


const uploadImg = async (href) => {
    try {
        let buffer = await downloadImage(href);
        // console.log(buffer)
        // break
        let resUrl = await uploadImageWashu(buffer);
        let newModel = {url: "https://image.jndroid.com/" + resUrl};
        console.log("上传成功")
        return newModel
    } catch (e) {
        console.error("上传失败")
        return false
    }
}


// const uploadImgFromLocal = async (buffer) => {
//     try {
//         let resUrl = await uploadImageWashu(buffer);
//         let newModel = {url: "https://image.jndroid.com/" + resUrl};
//         console.log("上传成功")
//         return newModel
//     } catch (e) {
//         console.error("上传失败")
//         return false
//     }
// }

exports.uploadImg = uploadImg
// exports.uploadImgFromLocal = uploadImgFromLocal