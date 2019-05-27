const process = require("process");
const redis = require("redis");
const Log = require("./log");

function RedisClient(option) {
    if (typeof option.host !== "string") throw new Error("missing host");
    if (typeof option.port !== "number") throw new Error("missing port");
    //if (typeof option.password !== "string") throw new Error("missing password");

    let mOption = option;
    let mRedisClient = null;

    this.connect = function() {
        return new Promise((resolve, reject) => {
            mRedisClient = redis.createClient(mOption);
            mRedisClient.on("ready", resolve);
            mRedisClient.on("error", reject);
            mRedisClient.on("end", () => {
                Log.e(`redis on end, process will exit...`);
                setTimeout(() => {
                    process.exit(-1);
                }, 5000);
            });
        });
    };

    this.end = function() {
        mRedisClient.removeAllListeners();
        return mRedisClient.end(true);
    };

    //唯一
    this.duplicate = function() {
        return new Promise((resolve, reject) => {
            mRedisClient.duplicate((err, client) => {
                if (err) return reject(err);
                resolve(client);
            });
        });
    };

    //过期
    this.expire = function(key, seconds) {
        return new Promise((resolve, reject) => {
            mRedisClient.expire(key, seconds, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    //标记事务块的开始
    this.multi = function() {
        return mRedisClient.multi();
    };

    //执行所有事务块命令
    this.exec = function(multi) {
        return new Promise((resolve, reject) => {
            multi.exec((err, replies) => {
                if (err) return reject(err);
                resolve(replies);
            });
        });
    };

    //Redis SET 命令用于设置给定 key 的值。如果 key 已经存储其他值， SET 就覆写旧值，且无视类型。
    this.set = function() {
        return new Promise((resolve, reject) => {
            let args = Array.prototype.slice.apply(arguments);
            args.push((err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
            mRedisClient.set.apply(mRedisClient, args);
        });
    };
    //Redis Get 命令用于获取指定 key 的值。如果 key 不存在，返回 nil 。如果key 储存的值不是字符串类型，返回一个错误。
    this.get = function(key) {
        return new Promise((resolve, reject) => {
            mRedisClient.get(key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.del = function(key) {
        return new Promise((resolve, reject) => {
            mRedisClient.del(key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };
    //Redis Incr 命令将 key 中储存的数字值增一。
    this.incr = function(key) {
        return new Promise((resolve, reject) => {
            mRedisClient.incr(key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.incrby = function(key, increment) {
        return new Promise((resolve, reject) => {
            mRedisClient.incrby(key, increment, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.incrbyfloat = function(key, increment) {
        return new Promise((resolve, reject) => {
            mRedisClient.incrbyfloat(key, increment, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.rename = function(key, newkey) {
        return new Promise((resolve, reject) => {
            mRedisClient.rename(key, newkey, (err, reply)  => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.mget = function(keys) {
        return new Promise((resolve, reject) => {
            if (keys.length == 0) return resolve([]);
            mRedisClient.mget(keys, (err, reply) => {
                if (err) return reject(err);
                if (reply) return resolve(reply);
                resolve([]);
            });
        });
    };

    this.rpush = function(key, value) {
        return new Promise((resolve, reject) => {
            mRedisClient.rpush(key, value, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.lpush = function(key, value) {
        return new Promise((resolve, reject) => {
            mRedisClient.lpush(key, value, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.lpop = function(key) {
        return new Promise((resolve, reject) => {
            mRedisClient.lpop(key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.rpop = function(key) {
        return new Promise((resolve, reject) => {
            mRedisClient.rpop(key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.blpop = function(client, key, timeout) {
        return new Promise((resolve, reject) => {
            client.blpop(key, timeout, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.llen = function(key) {
        return new Promise((resolve, reject) => {
            mRedisClient.llen(key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.lrange = function(key, start, end) {
        return new Promise((resolve, reject) => {
            mRedisClient.lrange(key, start, end, (err, reply) => {
                if (err) return reject(err);
                if (reply) return resolve(reply);
                resolve([]);
            });
        });
    };

    this.ltrim = function(key, start, end) {
        return new Promise((resolve, reject) => {
            mRedisClient.ltrim(key, start, end, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    //Redis Scard 命令返回集合中元素的数量。
    this.scard = function(key) {
        return new Promise((resolve, reject) => {
            mRedisClient.scard(key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    //Redis Sadd 命令将一个或多个成员元素加入到集合中，已经存在于集合的成员元素将被忽略。
    this.sadd = function(key, member) {
        return new Promise((resolve, reject) => {
            mRedisClient.sadd(key, member, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    //Redis Smembers 命令返回集合中的所有的成员。 不存在的集合 key 被视为空集合。
    this.smembers = function(key) {
        return new Promise((resolve, reject) => {
            mRedisClient.smembers(key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    //Redis Srandmember 命令用于返回集合中的一个随机元素。
    this.srandmember = function(key, count) {
        return new Promise((resolve, reject) => {
            mRedisClient.srandmember(key, count, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    //Redis Sismember 命令判断成员元素是否是集合的成员。
    this.sismember = function(key, member) {
        return new Promise((resolve, reject) => {
            mRedisClient.sismember(key, member, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    //Redis Srem 命令用于移除集合中的一个或多个成员元素，不存在的成员元素会被忽略。
    this.srem = function(key, member) {
        return new Promise((resolve, reject) => {
            mRedisClient.srem(key, member, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.hget = function(key, field) {

        return new Promise((resolve, reject) => {
            mRedisClient.hget(key, field, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.hset = function(key, field, value) {

        return new Promise((resolve, reject) => {
            mRedisClient.hset(key, field, value, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });

    };

    this.hdel = function(key, field) {
        return new Promise((resolve, reject) => {
            mRedisClient.hdel(key, field, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.hincrby = function(key, field, increment) {
        return new Promise((resolve, reject) => {
            mRedisClient.hincrby(key, field, increment, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.hmget = function(key, field) {
        return new Promise((resolve, reject) => {
            mRedisClient.hmget(key, field, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.zcard = function(key) {
        return new Promise((resolve, reject) => {
            mRedisClient.zcard(key, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.zadd = function(key, score, member) {
        return new Promise((resolve, reject) => {
            mRedisClient.zadd(key, score, member, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.zrank = function(key, member) {
        return new Promise((resolve, reject) => {
            mRedisClient.zrank(key, member, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.zscore = function(key, member) {
        return new Promise((resolve, reject) => {
            mRedisClient.zscore(key, member, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.zrem = function(key, member) {
        return new Promise((resolve, reject) => {
            mRedisClient.zrem(key, member, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.zrange = function(key, start, stop, withscores) {
        return new Promise((resolve, reject) => {
            if (withscores) {
                mRedisClient.zrange(key, start, stop, "withscores", (err, reply) => {
                    if (err) return reject(err);
                    if (reply) return resolve(reply);
                    resolve([]);
                });
            } else {
                mRedisClient.zrange(key, start, stop, (err, reply) => {
                    if (err) return reject(err);
                    if (reply) return resolve(reply);
                    resolve([]);
                });
            }
        });
    };

    this.zrangebyscore = function(key, min, max) {
        return new Promise((resolve, reject) => {
            mRedisClient.zrangebyscore(key, min, max, (err, reply) => {
                if (err) return reject(err);
                if (reply) return resolve(reply);
                resolve([]);
            });
        });
    };

    this.zrevrange = function(key, start, stop, withscores) {
        return new Promise((resolve, reject) => {
            if (withscores) {
                mRedisClient.zrevrange(key, start, stop, "withscores", (err, reply) => {
                    if (err) return reject(err);
                    if (reply) return resolve(reply);
                    resolve([]);
                });
            } else {
                mRedisClient.zrevrange(key, start, stop, (err, reply) => {
                    if (err) return reject(err);
                    if (reply) return resolve(reply);
                    resolve([]);
                });
            }
        });
    };

    this.zremrangebyrank = function(key, start, stop) {
        return new Promise((resolve, reject) => {
            mRedisClient.zremrangebyrank(key, start, stop, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.zremrangebyscore = function (key, min, max) {
        return new Promise((resolve, reject) => {
            mRedisClient.zremrangebyscore(key, min, max, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.keys = function(pattern) {
        return new Promise((resolve, reject) => {
            mRedisClient.keys(pattern, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.info = function(section) {
        return new Promise((resolve, reject) => {
            if (section) { } else section = "all";
            mRedisClient.info(section, (err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

    this.bgsave = function() {
        return new Promise((resolve, reject) => {
            mRedisClient.bgsave((err, reply) => {
                if (err) return reject(err);
                resolve(reply);
            });
        });
    };

}

exports.RedisClient = RedisClient;