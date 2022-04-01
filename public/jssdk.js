/**
 * title: sdk入口文件
 * email: supericesun@gmail.com
 */

(function () {
    const path = '//test.com:8096/', env = 'local', sdkName = '__JSSDK__', sdkId = 'jssdk-001', ts = 1648779170971;
    const isLocal = env === 'local', isTest = env === 'test', isProd = env === 'prod';
    // 最终打包出来的js和css文件，只引入口文件，根据实际打包出来的文件动态配置
    !isProd && console.log('jssdk版本：', new Date(ts).toLocaleString('zh'));
    const cssArr = ['css/app.css'];
    const jsArr = ['js/chunk-vendors.js', 'js/app.js'];
    let timer = null;
    let win = window.rawWindow || window.frames || window;

    // 已经加载过就不再执行
    if (win.__JSSDK_BOX) return;

    try {
        detectBody();
    } catch (e) {
        console.log('JSSDK报错', e);
    }

    function detectBody() {
        if (document.body) return main();
        clearTimeout(timer);
        timer = setTimeout(function () {
            detectBody();
        }, 100);
    }

    function main() {
        // ---------- 创建shadowdom ----------
        let box = document.createElement('div');
        box.id = '__jssdk_box';
        // box.style.setProperty('position', 'fixed', 'important');
        box.style = `position:fixed; left:0; top:0; z-index: 10001`;
        document.body.appendChild(box);

        // 所有环境直接走 shadowdom
        let shadow = box.attachShadow({ mode: 'open' }); // isLocal ? box : box.attachShadow({ mode: 'open' }); // 本地走普通 html 元素，其他环境走 shadowdom
        win.__JSSDK_BOX = shadow;

        // 每次build之后会更新时间戳，尽量减少缓存
        let tsStr = `?t=${ts}`;
        cssArr.forEach(function (href) {
            const link = document.createElement('link');
            link.href = `${path}${href}${tsStr}`;
            link.rel = 'stylesheet';
            !isLocal && shadow.appendChild(link);
        });

        jsArr.forEach(function (src) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `${path}${src}${tsStr}`;
            !isLocal && shadow.appendChild(script);
        });
    }

    // ---------- 对外接口 ----------
    let options = {};
    let localVars = { isShow: false, isClose: false, isRefresh: false };
    win[sdkName] = win[sdkName] || {};

    // 配置项
    win[sdkName].setOption = function (opts) {
        let res = { isSet: false };
        Object.assign(res, opts);
        if (opts) res.isSet = true;
        options = Object.assign(options, res); // 多次调用需要把配置属性组合
    };

    // 获取option，一开始可能会用到，之后统一从 utils.getOption() 获取
    win[sdkName].getOption = function () {
        return options;
    };

    // 显示相关
    win[sdkName].showMgt = function () {
        localVars.isShow = true;
    };
    win[sdkName].getVars = function (key) {
        if (key) return localVars[key];
        return localVars;
    };
})();