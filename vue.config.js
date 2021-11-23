let { npm_package_version, npm_package_sdkId, npm_package_sdkName, NODE_ENV } = process.env;

/**
 * local: 本地运行
 * test: 测试包
 * pre: 预发包
 * prod: 生产包
 */
let settings = {
    local: {
        VUE_PUBLIC_PATH: `//test.com:8096/`, // 资源地址
        VUE_APP_BASEURL: `//test.api.local.com`, // 接口请求地址
    },
    test: {
        VUE_PUBLIC_PATH: `//test.local.com/nc_${npm_package_version}/`,
        VUE_APP_BASEURL: `//test.api.local.com/api/`,
    },
    pre: {
        VUE_PUBLIC_PATH: `//test.local.com/nc_${npm_package_version}/`,
        VUE_APP_BASEURL: `//pre.api.local.com/api/`,
    },
    prod: {
        VUE_PUBLIC_PATH: `//notice.local.com/nc_${npm_package_version}/`,
        VUE_APP_BASEURL: `//api.local.com/api/`,
    },
};

// 获取参数：--env=prod 转为 {env: 'prod'}
let argsMap = {};
process.argv.map((str, i) => {
    if (!/--\w+=\w+/gmi.test(str)) return;
    let arr = str.replace(/^--/g, '').split('=');
    argsMap[arr[0]] = arr[1];
});
let { env } = argsMap;
Object.assign(process.env, settings[env]);

let { VUE_PUBLIC_PATH, VUE_APP_BASEURL } = process.env;
process.env.VUE_ENV = env;
process.env.VUE_APP_SDKID = npm_package_sdkId;
process.env.VUE_APP_SDKNAME = npm_package_sdkName;
console.log(VUE_APP_BASEURL, VUE_PUBLIC_PATH, env);

require('./before_run');

module.exports = {
    lintOnSave: false,
    // index.html中引用js、css的地址，production就是打包后的环境，./.表示当前目录，/表示根目录
    publicPath: NODE_ENV === 'production' ? VUE_PUBLIC_PATH : '/',
    // 编译成ES5
    transpileDependencies: [],
    // 关闭生产环境sourcemap
    productionSourceMap: false,
    // 关闭文件hash
    filenameHashing: false,
    lintOnSave: false,
    outputDir: `./dist/${npm_package_version}/`,
    css: {
        loaderOptions: {
            sass: {
                additionalData: '@import "./src/assets/style/common/_var.scss";',
            },
        },
    },
    configureWebpack: config => {
        config.output.jsonpFunction = `wj_${process.env.VUE_APP_SDKID}`;

        // 修改iconfont打包方式，为了兼容跨域，这里设置成比较大的值，最终以base64形式打包进css里
        // config.module.rules.push({
        //     test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        //     use: [{
        //         loader: 'url-loader',
        //         options: {
        //             limit: 1000000000,
        //         }
        //     }]
        // });
        // console.log(config.module.rules)
        // config.module.rules[4].use[0].options.limit = 1000000000;

        // mode !== 'local' && config.module.rules.push({
        //     test: /quill\.js$/i,
        //     use: [{
        //         loader: './src/utils/quill-loader.js',
        //     }]
        // });

        // 设置别名
        // config.resolve.alias["element-ui"] = resolve("src/element-ui");

        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
        } else {
            // 为开发环境修改配置...
        }
    },
    // webpack-dev-server
    devServer: {
        disableHostCheck: true,
        port: 8096,
    },
}