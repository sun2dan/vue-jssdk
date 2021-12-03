/**
 * title: 公共方法，主要是对字符串、数组、对象进行一些公共处理，不包含sdk相关的逻辑处理
 * email: supericesun@gmail.com
 */

let utils = {
    // 获取数据类型
    getType(data) {
        let type = Object.prototype.toString.call(data);
        let result = type.replace(/^\[object\s+(\w+)\]$/gmi, "$1");
        return result.toLowerCase();
    },

    clone(data) {
        try {
            return JSON.parse(JSON.stringify(data));
        } catch (e) {
            return {};
        }
    },

    // 移除前后空格
    removeBlanks(str) {
        return str.replace(/(^\s+)|(\s+$)/g, "")
    },

    // hex转rgba
    hexToRgba(hex, opacity) {
        let rgbStr = utils.hexToRgbStr(hex);
        return opacity === undefined ? `rgb(${rgbStr})` : `rgba(${rgbStr}, ${opacity})`;
    },

    // hex转 '255,255,255' 这种字符串
    hexToRgbStr(hex) {
        let r = parseInt("0x" + hex.slice(1, 3));
        let g = parseInt("0x" + hex.slice(3, 5));
        let b = parseInt("0x" + hex.slice(5, 7));
        let rgbStr = `${r},${g},${b}`;
        return rgbStr;
    },

    // 过滤值为 null、undefined、空字符串 的属性
    filterNullField(obj) {
        let data = utils.clone(obj);
        for (const key in data) {
            const obj = data[key];
            if (obj === '' || obj === undefined || obj === null) delete data[key];
        }
        return data;
    },

    // 格式化日期时间
    formatDateTime: (date, formatStr) => {
        if (!date) return '';

        formatStr = formatStr || 'yyyy-MM-dd HH:mm:ss';
        if (/\d+/gmi.test(date.toString())) date = new Date(date);

        let y = date.getFullYear();
        let M = (date.getMonth() + 1).toString().padStart(2, 0);
        let d = date.getDate().toString().padStart(2, 0);
        let h = date.getHours().toString().padStart(2, 0);
        let m = date.getMinutes().toString().padStart(2, 0);
        let s = date.getSeconds().toString().padStart(2, 0);

        return formatStr.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('HH', h).replace('mm', m).replace('ss', s);
    },

    //
    async sleep(time) {
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    },

    // 获取随机字符串
    getRandomStr(n = 4) {
        var jschars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var res = "";
        for (let i = 0; i < n; i++) {
            let id = Math.ceil(Math.random() * 35);
            res += jschars[id];
        }
        return res;
    },

    // 获取元素在页面上的绝对位置
    getAbsolutePos(obj) {
        var left = 0;
        var top = 0;
        while (obj) {
            left += obj.offsetLeft;
            top += obj.offsetTop;
            obj = obj.offsetParent;
        }
        return { left: left, top: top };
    },

    // 格式化色值，#fac => #ffaacc；不符合的返回空字符串
    getFormatColor(theme) {
        if (!theme) return '';

        if (!/#([\w\d]{3}|[\w\d]{6})/gim.test(theme)) {
            console.log(
                `主题色参数有误，格式应为 #FAC 或 #FAFBFC，当前值为：${theme}`
            );
            return '';
        }

        // 转成标准的6位hex色值
        if (theme.length === 4) {
            let arr = theme.split("");
            theme = arr
                .map((c, i) => {
                    return i === 0 ? c : c + c;
                })
                .join("");
        }
        return theme;
    },

    // 把一个字符串中的$变量替换掉，colorMap为要替换的变量对象
    getThemeStr(styleStr, colorMap) {
        if (!colorMap) return '';

        for (const key in colorMap) {
            const color = colorMap[key];
            if (!color) continue;
            color = utils.getFormatColor(color);
            let rgbStr = utils.hexToRgbStr(color);

            let regexp = new RegExp(`rgba\\(\\$${key}\,([\\d\.]+)\\)`, 'gmi'); // rgba(#ffa, .8)的形式转换成 rgba(r, g, b, a) 的形式
            let reg = new RegExp(`\\$${key}`, 'gmi');

            styleStr = styleStr.replace(regexp, `rgba(${rgbStr},$1)`).replace(reg, color);
        }
        return styleStr.replace(/\n\s+/g, "\n");
    },
}

// module.exports = utils;
export default utils;