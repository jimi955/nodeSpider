const request = require("request");
const getApi = require("../api/fetch").getApi;
const encoding = require("encoding")
const jsdom = require("jsdom");
const getProxy = async () => {
    const href = "http://d.jghttp.golangapi.com/getip?num=1&type=2&pro=&city=0&yys=0&port=11&pack=1141&ts=0&ys=0&cs=0&lb=1&sb=0&pb=4&mr=0&regions=";
    let re = await getApi(href)
    re = re.data[0]
    re = "http://" + re.ip + ":" + re.port
    return re;
}


const requestSync = (option) => {
    return new Promise((resolve, reject) => {
        request(option, (err, res) => {
            if (err) {
                return reject("request failed");
            }
            return resolve(res.body);
        })
    })
};


(async () => {
    try {
        let href = "https://www.zhihu.com/api/v4/members/" + "gilbert-17-78" + "/answers?include=data[*].is_normal,admin_closed_comment,reward_info,is_collapsed,annotation_action,annotation_detail,collapse_reason,collapsed_by,suggest_edit,comment_count,can_comment,content,voteup_count,reshipment_settings,comment_permission,mark_infos,created_time,updated_time,review_info,question,excerpt,relationship.is_authorized,voting,is_author,is_thanked,is_nothelp;data[*].author.badge[?(type=best_answerer)].topics&offset=" +
            0 +
            "&limit=" + 20 + "&sort_by=created";
        let proxy = await getProxy();
        let d = await requestSync({
            url: href,
            proxy: proxy,
            headers: {
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.79 Safari/537.36",
                'Content-Type': 'application/json',
            },
        })
        console.log(JSON.parse(d));
        if(d.indexOf("您现在的 IP：") > -1){
            console.log("有用的");
        }else{
            console.log("没用的");
        }

    } catch (e) {
        console.log(e);
        console.log("坏蛋了");
    }
})()

