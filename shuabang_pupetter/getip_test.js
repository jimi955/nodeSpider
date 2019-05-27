const getApi = require("../api/fetch").getApi;
const File = require("fs");
const Queue = require("../api/queue").Queue;

let proxy;
const initProxy = async () => {
    try {
        let data = await getApi("http://webapi.http.zhimacangku.com/getip?num=1&type=2&pro=&city=0&yys=0&port=11&pack=38617&ts=1&ys=1&cs=1&lb=1&sb=0&pb=4&mr=1&regions=")
        proxy = data.data[0]
        console.log("注意××××××××####### 换新的ip啦")
        console.log("注意××××××××####### 换新的ip啦")
        console.log(proxy)
        if (proxy) {
            proxy.data = new Date();
            await Queue.postDataToMessage("ip_pool", JSON.stringify(proxy));

            File.appendFileSync("ip_pool.txt", JSON.stringify(proxy) + "\n")
            return true
        } else {
            return false
        }
    } catch (e) {
        return false
    }
}
const sleep = async (s = 5) => {
    return new Promise(resolve => {
        setTimeout(resolve, s * 1000)
    })
}

(async () => {
    while (true) {
        let re = await initProxy()
        if (!re) {
            await sleep(10)
            continue
        }
        await sleep(170)
    }

})()

