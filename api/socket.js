const io = require("socket.io-client");


let mSocket = io('http://ws.api.talkmoment.com:51179');
let mBeeName = null;
let Socket = {};

Socket.startHeartBeat = (beeName) => {
    mBeeName = beeName;
    setInterval(() => {
        mSocket.emit("bee_heart_beat", {bee_name: mBeeName});
    }, 5000);
};

Socket.error = Socket.log = function() {
    let data = formatDevLog(arguments);
    console.log(data);
    mSocket.emit("bee_log", data);
};

Socket.emitEvent = function(data) {
    mSocket.emit("bee_event", data);
};

function formatDevLog(logArgs) {
    let parts = Array.prototype.map.call(logArgs, (log) => {
        if (typeof log === "string") return log;
        return JSON.stringify(log);
    });
    return "[" + new Date().toString() + "][" + mBeeName + "]" + Array.prototype.join.call(parts, " ");
}
exports.Socket = Socket;