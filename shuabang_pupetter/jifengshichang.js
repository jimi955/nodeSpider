//遍历首页更新
// const Task = require('../api/task').Task;
const puppeteer = require('puppeteer');
// const Http = require("../api/http").Http;
// const readLine = require("lei-stream").readLine;
const Queue = require("../api/queue").Queue;
//ip代理--------------------------------------------
const readFile = require("../apiofxx/readFile").readFile;
const request = require("request");
const getApi = require("../api/fetch").getApi;
const initProxy = async () => {
    let ds = await readFile("ip_pool.txt")
    proxy = ds.pop()
    console.log("注意××××××××####### 换新的ip啦")
    console.log("注意××××××××####### 换新的ip啦")
    console.log(proxy)
}
let proxy;
//-------------------------------------------------
let download_count = 1;

const log = function (d) {
    console.log(d)
}
const sleep = (s = 5) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000))
};


let pages = []

process.on('uncaughtException', (err) => {
    console.log("捕获到异常 而且不想管他", err);
});


let browser
//调出浏览器，打开指定页面
const launchBrowser = async () => {
    try {
        browser = await puppeteer.launch({
            //选择有界面的浏览器
            headless: false,
            //在puppeteer里面找到执行浏览器的路径
            // executablePath: "/home/zqy/Desktop/Spiders2/node_modules/puppeteer/.local-chromium/linux-594312/chrome-linux/chrome",
            executablePath: process.env.PUPPETEER_CHROME_PATH,
            timeout: 0,
            devtools: false,
            args: ['--proxy-server=http://' + proxy.ip + ':' + proxy.port]
        });

        //打开新页面
        pages[0] = await browser.newPage();
        await pages[0].setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/70.0.3538.77 Chrome/70.0.3538.77 Safari/537.36");
        //设置界面大小
        await pages[0].setViewport({
            width: 1920,
            height: 1080,
            isLandscape: true
        });
        log("打开百度搜索首页");
        try {
            await pages[0].goto('https://www.baidu.com/');
        } catch (e) {
            console.log("打开百度首页失败，正在重试");
            await pages[0].reload();
            await sleep();
            return

        }
        log("搜索机锋市场");
        await sleep(5)
        await pages[0].waitForSelector("input[id=kw]");
        const keyword = await pages[0].$("input[id=kw]");
        await keyword.click();
        let Str = "机锋市场";
        await keyword.type(Str, {delay: 50});
        log("点击搜索")
        const searchbtn = await pages[0].$("input[id=su]");
        await searchbtn.click();
        await sleep(2)
        await pages[0].waitForSelector("div[id='2']");
        log("进入机锋市场")
        let search1 = await pages[0].$("div[id='2'] .t > a");
        await search1.click();
        await sleep(8)
        let ps = await browser.pages()
        log(ps.length)
        if (ps.length == 2) {
            ps = await browser.pages()
            if (ps.length == 2) {
                return
            }
        }


        pages[1] = ps[2]
        await pages[1].setViewport({
            width: 1920,
            height: 1080,
            isLandscape: true
        });
        log("搜索社团")
        await pages[1].waitForSelector("input[id='q']");
        let keyword1 = await pages[1].$("input[id='q']");
        await keyword1.click();
        let Str1 = "点";
        await keyword1.type(Str1, {delay: 50});
        log("点击搜索")
        const searchbtn1 = await pages[1].$("input[id='btnSearch']");
        await searchbtn1.click();
        await sleep()
        await pages[1].waitForSelector(".lp-app-list > li .apphot-tit > a");
        await pages[1].evaluate(() => {
            console.log("注入js")
            // var index = setInterval(function () {
            //     window.scrollTo(0, document.documentElement.scrollTop + 250);
            // }, 50);
            // setTimeout(() => {
            //     clearInterval(index)
            //     console.log("ddd")
            let apps = document.querySelectorAll(".lp-app-list > li");
            for (let app of apps) {
                let appname = app.querySelector(".apphot-tit > a").textContent
                console.log(appname)
                if (appname.indexOf("聊点") == -1) {
                    app.remove()
                }
            }
            // }, 10000)
        })
        await sleep(10)
        log("444")

        let liaodian = await pages[1].$(".lp-app-list > li .apphot-tit > a");
        log("555")

        await liaodian.click()
        await sleep(8)
        let ps1 = await browser.pages()
        log(ps1.length)
        if (ps1.length == 3) {
            ps1 = await browser.pages()
            if (ps1.length == 3) {
                return
            }
        }
        pages[2] = ps1[3]
        await pages[2].setViewport({
            width: 1920,
            height: 1080,
            isLandscape: true
        });
        await sleep()
        await pages[2].waitForSelector(".app-view-bt > a");
        const download1 = await pages[2].$(".app-view-bt > a");
        await download1.click();
        let time = new Date();
        let obj = {download_count,time};
        await Queue.postDataToMessage("shuabang_jifeng_liaodian", JSON.stringify(obj));
        console.log("当前下载量为：", download_count++)

        await sleep(10)

        console.log("已启动");
    } catch (e) {
        console.log(e)
    }
};


const shutdownWindow = async () => {

    await browser.close()
}

(async () => {

    while (true) {
        // let pass = parseInt(Date.now() / 1000 / 60)
        // console.log(pass)
        await initProxy()
        try {
            console.log(1)
            //1：启动浏览器
            await launchBrowser()
            console.log("结束")

        } catch (e) {
            console.log(e)

        }
        await shutdownWindow()

    }

})();

