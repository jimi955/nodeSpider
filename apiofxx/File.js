//对于一个对象进行排序
const sortObj = (obj) => {
    var arr = [];
    for (var i in obj) {
        arr.push([obj[i], i]);
    }
    arr.sort(function (a, b) {
        return a[0] - b[0];
    });
    var len = arr.length,
        obj = {};
    for (var i = 0; i < len; i++) {
        obj[arr[i][1]] = arr[i][0];
    }
    return obj;
}

const sort_obj = async (attr, rev) => {
    //根据数组中的对象某个属性排序
    // * 使用例子：newArray.sort(sortBy('number',false)) //表示根据number属性降序排列;若第二个参数不传递，默认表示升序排序
    // * @param attr 排序的属性 如number属性
    // * @param rev true表示升序排列，false降序排序
    //第二个参数没有传递 默认升序排列
    if (rev == undefined) {
        rev = 1;
    } else {
        rev = (rev) ? 1 : -1;
    }

    return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}
exports.sortObj = sortObj;
exports.sort_obj = sort_obj;