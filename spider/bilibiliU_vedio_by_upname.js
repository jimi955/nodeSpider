//根据关键词找到up主，爬取up主的最新视频

const Task = require('../api/task').Task;
const getPage = require('../api/fetch').getPage;
const jsdom = require('jsdom');
const File = require("fs");
const getApi = require("../api/fetch").getApi;
const Http = require("../../nodePart/api/http").Http;

const BEE_NAME = "BiliBiliU";

const task_name = "bilibili_video_detail";

let moreArgs = {
    headers: {
        'Content-Type': 'charset=utf-8',
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
        "Connection": "keep-alive",
        "Cookie": "finger=49387dad;"
    },
    timeout: 5000
};

//获取列表页index
const search = async (name) => {
    //构造首页URL
    let href = "https://search.bilibili.com/all?keyword=" + encodeURIComponent(name) + "&from_source=banner_search";
    //请求页面信息
    console.log(href); //测试 输出url

    let html = await getPage(href, moreArgs);

    // File.appendFileSync("view.html", html)
    //结构化页面信息
    let d = new jsdom.JSDOM(html);
    // console.log(html)
    let document = d.window.document;
    //获取URL（进入指定的列表页）
    let url = document.querySelector(".info-wrap .title").getAttribute('href');
    console.log(url);
    url = url.split('/');
    index = url[url.length - 1].split('?')[0];
    console.log(index);
    return index
};

const get_ts = async (index) => {

    let url = "https://space.bilibili.com/ajax/member/getSubmitVideos?mid=" + index + "&page=1&pagesize=25";

    // console.log(url)
    let ts = await getApi(url, moreArgs);
    // console.log(tiezis)
    ts = ts.data.vlist;

    console.log(ts);
    console.log(ts.length);
    return ts
}

const get_contents = async (id) => {
    let comments_url = "https://bcy.net/apiv3/cmt/reply/list?page=1&item_id=" + id + "&sort=hot";
    //获取帖子的评论
    let d = await getApi(comments_url);
    d = d.data.data;
    //保存一条帖子的所有的评论
    let contents = [];
    for (let s of d) {
        contents.push(s.content);
    }
    return contents
}

//查看过滤器中是否存在数据
const filterItems = async (data) => {
    let query = {
        partition: BEE_NAME,
        keys: data.map((item) => {
            return "https://www.bilibili.com/video/av" + item.aid
        })
    }
    // console.log(query)
    //进行过滤，返回过滤报告
    let res = await Http.call("http://bee.api.talkmoment.com/dereplicate/filter/by/history", query);
    // console.log("test")

    res = JSON.parse(res);//结构化过滤报告
    // console.log(res,"filterRES");
    //根据过滤报告进行删减
    data = data.filter((item, i) => (res.result.filter_result[i]));
    // console.log(data)
    return data;

};

//布隆过滤器添加数据
const postDataToDereplicate = async (data) => {
    let query = {
        partition: BEE_NAME,
        key: "https://www.bilibili.com/video/av" + data.aid
    };
    // 异步执行请求
    await Http.call(`http://bee.api.talkmoment.com/dereplicate/history/add`, query);
};

//传数据去清洗再传到乐高库，或者自己清洗好直接传到乐高库
const postWashTask = async (brick_id, data) => {
    let washTask = {
        name: "wash_corpus",
        value: "",
        config: JSON.stringify({
            bee_source: BEE_NAME,
            brick_id: brick_id,
            publish: true
        }),
        data: JSON.stringify(data),
        scheduled_at: Date.now()
    };
    //传送数据
    let re = await Http.call("http://bee.api.talkmoment.com/scheduler/task/post", washTask);
    console.log(re);
    re = JSON.parse(re).err_no;
    return re;
};

//睡眠5秒
const sleep = (s = 5) => {
    return new Promise(resolve => setTimeout(resolve, s * 1000))
};

const bilibiliVideoDetail_task = async (task_name, brick_id, t) => {
    //即刻 最右 微博 b站点 头条
    const sendTaskUrl = "http://bee.api.talkmoment.com/scheduler/task/post";
    // let as = [
    //     "bilibili_video_detail",
    // ];
    // for(let a of as){
    let postData = {
        name: task_name,
        value: "https://www.bilibili.com/video/av" + t.aid,
        config: JSON.stringify({
            brick_id: brick_id,
            up_name: t.author,
            key_words: t.title,
            publish: true
        }),
        scheduled_at: new Date().getTime()
    };
    console.log(postData);
    await Http.call(sendTaskUrl, postData);
    // }
};

(async () => {

    while (true) {
        try {
            // 1:拿任务
            // console.log("test") // 测试
            let task = await Task.fetchTask(BEE_NAME);
            // 2：获取任务名
            let name = task.value;
            // 3:请求首页页面的信息
            let index = await search(name);

            // let index = await search('木鱼水心');
            // // 4:获取所有的帖子信息
            let ts = await get_ts(index);

            //5:获取任务的brick_id为上传做准备
            let brick_id = JSON.parse(task.config).brick_id;
            // let brick_id = 26639

            //6:filter去重
            ts = await filterItems(ts);
            //
            // 7:数据清洗或者上传到库
            console.log("111111111111")
            console.log(ts.length)
            for (let t of ts) {
                //1:布隆过滤器
                // await postDataToDereplicate(t);

                // 发布任务给bilibilivideodetail
                await bilibiliVideoDetail_task(task_name, brick_id, t)
            }
            console.log("上传条数" + ts.length)
        } catch
            (e) {
            console.log("----------");
            console.log(e, "task Error");
            await sleep(5);
        }
    }

})();