/**
 * title: sdk逻辑相关公共方法
 * email: supericesun@gmail.com
 */

import utils from "./utils";

let SDKNAME = process.env.VUE_APP_SDKNAME;
let options = {};

let styelArrMap = { }; // 样式数组，把多个需要添加style的操作合并到一个操作中
let timer = { shadow: null, body: null };

let sdkUtils = {
    // 保存option
    saveOption(data = {}) {
        options = data;
    },

    // 获取参数
    getOption(key) {
        if (!key) return options;
        return options[key];
    },

    // 获取全局SDK对象
    getSdkObj() {
        window[SDKNAME] = window[SDKNAME] || {};
        let obj = window[SDKNAME];
        let validFns = ['setOption', 'getOption'];
        for (let i = 0; i < validFns.length; i++) {
            const fnName = validFns[i];
            const type = utils.getType(obj[fnName]);
            if (type !== 'function') {
                return console.error(`window.${SDKNAME}对象异常`, obj);
            }
        }
        return obj;
    },

    // 公共日志
    log(msg, ...info) {
        let color = pageUtils.getOption('themeColor');
        let content = `%c【${SDKNAME}】`;
        if (utils.getType(msg) === 'string') content += msg;
        else info.unshift(msg);
        console.log(content, `color:${color || 'blue'}`, ...info);
    },

    // 往body或shadow中添加style标签，100ms内的样式合并添加
    appendStyle(styleStr, name, type = "shadow") {
        let id = `style_${name}`;
        styelArrMap[name] = styelArrMap[name] || [];
        let arr = styelArrMap[name];
        arr.push(styleStr);
        clearTimeout(timer[name]);

        timer[name] = setTimeout(() => {
            let box = type === 'body' ? document.body : window.__JSSDK_BOX;
            let style = box.querySelector(`#${id}`);

            // iconfont 只加载一次，因为SaaSWings下有三个jssdk，都会添加iconfont
            if (name === 'iconfont' && style && style.innerText.length > 100) return;

            if (!style) style = document.createElement("style");
            style.innerHTML = arr.join("").replace(/\n\s+/g, "\n");
            style.type = "text/css";
            style.id = id;
            style.setAttribute('role', "jssdk");
            style.setAttribute('from', "saaswings");

            box.appendChild(style);
            styelArrMap[name] = [];
        }, 50);
    },
}

export default sdkUtils;