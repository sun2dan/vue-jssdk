(function () {
    const path = '//test.local.com:8096/', env = 'local', sdkName = '__JSSDK__', sdkId = 'jssdk-001', ts = 1637232736416;;
    const isLocal = env === 'local', isTest = env === 'test', isProd = env === 'prod';
    const cssArr = ['css/chunk-vendors.css', 'css/app.css'];
    const jsArr = ['js/chunk-vendors.js', 'js/app.js'];

    // ---------- 创建shadowdom ----------
    let box = document.createElement('div');
    box.id = '__jssdk_box';
    // box.style.setProperty('position', 'fixed', 'important');
    box.style = `position:fixed; left:0; top:0; z-index: 10001`;
    document.body.appendChild(box);

    // 本地走普通 html 元素，其他环境走 shadowdom
    let shadow = isLocal ? box : box.attachShadow({ mode: 'open' });
    window.__JSSDK_BOX = shadow;

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

    // ---------- 对外接口 ----------
    let options = {}, isShow = false;
    window[sdkName] = window[sdkName] || {};

    // 配置项
    window[sdkName].setOption = function (opts) {
        let res = { isSet: false };
        Object.assign(res, opts);
        if (opts) res.isSet = true;
        options = res;
    };

    // 获取option，一开始可能会用到，之后统一从 utils.getOption() 获取
    window[sdkName].getOption = function () {
        return options;
    };

    // 显示相关
    window[sdkName].showMgt = function () {
        isShow = true;
    };
    window[sdkName].getIsShow = function () {
        return isShow;
    };
})();