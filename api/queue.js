const Http = require("../api/http").Http;
const getApi = require("../api/fetch").getApi;

let Queue = {}

Queue.postDataToMessage = async (queueName, data) => {
    return await Http.call(`http://bee.api.talkmoment.com/message/publish?topic=${queueName}`, data);
};

Queue.getDataFromMessage = async (queueName) => {
    return await getApi(`http://bee.api.talkmoment.com/message/subscribe/try?topic=${queueName}`, {timeout: 5000})
}

Queue.readAllDateFromMessage = async (queueName) => {
    return await getApi(`http://bee.api.talkmoment.com/message/detail?topic=${queueName}&limit=10000000&offset=0`)
}

Queue.clear = async (queueName) => {
    while (true) {
        await Queue.getDataFromMessage(queueName);
    }
    return null;
}

Queue.readDateFromMessage = async (queueName, offset) => {
    return await getApi(`http://bee.api.talkmoment.com/message/detail?topic=${queueName}&limit=1&offset=${offset}`);
}


Queue.detail = async (queueName, limit) => {
    let result = await getApi("http://bee.api.talkmoment.com/message/detail?topic=" + queueName + "&limit=" + limit + "&offset=0");
    return result;
}

Queue.size = async (queueName) => {
    let result = await getApi("http://bee.api.talkmoment.com/message/status");
    result = result.result[0];
    let size = 0;
    for (let i = 0; i < result.length; i++) {
        if (result[i].topic === queueName) {
            size = result[i].topic;
            break;
        }
    }
    return size;
}
exports.Queue = Queue;