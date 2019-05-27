const File = require("fs");
const MongoDB = require("../../Core/mongodb");
const MONGO_CONF = {"host": "localhost", "port": 27017, "database": "groups"};
// MongoDB.connectMongoDB(MONGO_CONF);
module.exports = {
    summary: '进入中间键',
    beforeSendResponse(requestDetail, responseDetail) {
        // File.appendFileSync("info.txt",requestDetail+"\n")
        console.log(1);
        return responseDetail;
    },
    beforeSendRequest(requestDetail, responseDetail){
        console.log(3)
        return requestDetail;
    }
};
// MongoDB.close()