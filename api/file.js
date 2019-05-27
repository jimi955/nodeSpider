const File = require("fs")
const readLine = require("lei-stream").readLine;
let getOneLine = (fileName) => {
    let data = File.readFileSync(fileName, 'utf8');
    data = data.split("\n");
    let result = data.shift();
    let w = ""
    for (let da of data) {
        w = w + da + "" + "\n";
    }
    File.writeFile(fileName, w, function (err) {
    });
    result = JSON.parse(result);
    return result;
}

let flashback = (fileName) => {
    let data = File.readFileSync(fileName, 'utf8');
    data = data.split("\n");
    data.reverse();
    let w = ""
    for (let da of data) {
        w = w + da + "" + "\n";
    }
    File.writeFile(fileName, w, function (err) {
    });
}

let getLastestData = (fileName) => {
    let data = File.readFileSync(fileName, 'utf8');
    data = data.split("\n");
    data.reverse();
    let i = 0;
    while(!data[i]){
        i++ ;
    }
    return data[i];
}


exports.getOneLine = getOneLine;
exports.flashback = flashback;
exports.getLastestData = getLastestData;