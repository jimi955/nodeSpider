const fetch = require("node-fetch");
const iconv = require("iconv-lite");
const safeFetch = async (url, moreArgs = {}) => {
    try {
        return await fetch(url, moreArgs);
    } catch (e) {
        return false;
        console.error(e);
    }
};

const getApi = async (url, moreArgs = {
    headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
        "Connection": "keep-alive",
    }
}) => {
    let res = await safeFetch(url, moreArgs);
    if (res !== undefined && res.status === 200) {
        return res.json();
    } else {
        return false;
    }
};

const plainApi = async (url, moreArgs = {
    headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
        "Connection": "keep-alive",
    }
}) => { 
    let res = await safeFetch(url, moreArgs);
    if (res !== undefined && res.status === 200) {
        return res.text();
    } else {
        return false;
    }
}


const getPage = async (url, moreArgs = {
    headers: {
        'Content-Type': 'charset=utf-8',
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36",
        "Connection": "keep-alive",
    }
}) => {
    let res = await safeFetch(url, moreArgs);
    if (res !== undefined && res.status === 200) {
        return res.text();
    } else {
        return false;
    }
};


exports.getApi = getApi;
exports.getPage = getPage;