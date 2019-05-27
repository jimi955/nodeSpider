const fs = require("fs");
const sleep = (s = 5) => {
    return new Promise((resolve) => {
        setTimeout(resolve, s * 1000)
    })
}
let download_count = 0;
let path = "C:/Users/Administrator/Downloads"

const deleteFolder = async (path) => {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        download_count += files.length
        console.log("当前下载量为：", download_count)
        files.forEach(function (file, index) {
            let curPath = path + "/" + file;
            console.log(curPath)
            if (fs.statSync(curPath).isDirectory()) { // recurse
                // deleteFolder(curPath);
                console.log("don't delete dir")
            } else { // delete file
                fs.unlinkSync(curPath, function (err) {
                    if (err) {
                        console.error();
                        throw err;
                    }
                });
                console.error('delete file name: ' + file);
                // fs.rmdirSync(path);
            }
        });
    }
}
(async () => {
    while (true) {
        try {
            await deleteFolder(path);
            await sleep(60*30)
        } catch (e) {
        }
    }
})()
