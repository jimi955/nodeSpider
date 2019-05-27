const readLine = require("lei-stream").readLine


const readFile = (fileName) => {
    let result = []
    return new Promise((resolve, reject) => {
        readLine(fileName).go((data, next) => {
            try {
                data = JSON.parse(data);
                result.push(data);
            } catch (e) {

            }
            next()
        }, () => {
            resolve(result);
        })
    })
}
exports.readFile = readFile
