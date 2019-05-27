var request = require("request");
const getCookie = async () => {
    var options = {
        method: 'POST',
        url: 'https://www.itjuzi.com/api/authorizations',
        headers:
            {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        form: {
            'account': '17355891658',
            'password': 'lbxxzgx66'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(JSON.parse(body));
        // console.log(response.headers['set-cookie'][0].split(";").shift());
    });
}
(async () => {
    let cookie = await getCookie()
    // console.log("aa")
})()

