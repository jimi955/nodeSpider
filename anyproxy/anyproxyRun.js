const AnyProxy = require('anyproxy');
const options = {
    port: 8001,
    rule: require('./MIDDLE'),
    webInterface: {
        enable: true,
        webPort: 8002
    },
    silent: true,
    throttle: 10000,
    forceProxyHttps: false,
    wsIntercept: false, // 不开启websocket代理
    silent: false
};
const proxyServer = new AnyProxy.ProxyServer(options);

proxyServer.on('ready', () => {
    console.log("代理服务器启动完成");
});

proxyServer.on('error', (e) => {
    console.log("代理服务器发生错误", e);
});

proxyServer.start();

//when finished
proxyServer.close();