let fs = require('fs');

let { VUE_PUBLIC_PATH, VUE_ENV, VUE_APP_SDKNAME, VUE_APP_SDKID } = process.env;
const sdkId = VUE_APP_SDKID;
const sdkCls = `.${sdkId}`;

const handleScss2Js = {
    // css高级压缩
    packAdv: (cont) => {
        cont = cont.replace(/\/\*(.|\n)*?\*\//g, "");
        cont = cont.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
        cont = cont.replace(/\,[\s\.\#\d]*\{/g, "{");
        cont = cont.replace(/;\s*;/g, ";");
        cont = cont.match(/^\s*(\S+(\s+\S+)*)\s*$/);
        return (cont == null) ? "" : cont[1]
    },
    // css普通压缩
    pack: (cont) => {
        cont = cont.replace(/\/\*(.|\n)*?\*\//g, "");
        cont = cont.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
        cont = cont.replace(/\,[\s\.\#\d]*\{/g, "{");
        cont = cont.replace(/;\s*;/g, ";");
        cont = cont.replace(/;\s*}/g, "}");
        cont = cont.replace(/([^\s])\{([^\s])/g, "$1{$2");
        cont = cont.replace(/([^\s])\}([^\n]s*)/g, "$1}\n$2");
        return cont;
    },

    // 从scss文件中获取格式化好的字符串
    getContFromScssFile(filePath) {
        let cont = '';
        if (typeof (filePath) === 'string') cont = fs.readFileSync(`./src/${filePath}`, 'utf-8');
        else {
            filePath.forEach((p) => {
                cont += fs.readFileSync(`./src/${p}`, 'utf-8');
            });
        }

        // 注意replace顺序
        // 处理sass中的变量：class名补全、局部class添加作用域class（主题色变量不要处理）
        cont = cont.replace(/^([\.\w\d]+)/gm, `${sdkCls} $1`). // .开头的前面添加sdk的class作用域
            replace(/&-/gm, `${sdkCls}-`).  // 包含 &- 的需要替换成sdk的class
            replace(/&/gm, sdkCls);
        let arr = cont.split('\n');

        // 如果只有顶部用了@引用和charset配置，可以只删除前几行
        // 删除scss中@chartset、@import、//注释 之类的行，@font不删除
        // "/*" 开头的注释不用管，因为css支持（也不太好匹配）
        for (let i = arr.length - 1; i >= 0; i--) {
            let str = arr[i];
            if (str.startsWith('@font')) continue;
            if (/^(@|(\/\/))/gmi.test(str)) arr.splice(i, 1);
        }

        let zipCont = this.pack(arr.join(''));
        return `\`${zipCont}\``; // 输出格式为折行，非\n字符串，对比、找错更容易些
    },

    // 把可能需要动态渲染/覆盖的css内容作为字符串存储到js文件中
    updateJsVar(fileList, jsPath) {
        let arr = [];
        fileList.map(item => {
            let cont = this.getContFromScssFile(item.path);
            arr.push(`${item.key}: ${cont}`)
        });
        const jsCont = `export default { ${arr.join(', ')} };`;
        fs.writeFileSync(jsPath, jsCont);
    },

    // 入口
    do() {
        let scssFileList = [
            { path: ['assets/style/common/_theme.scss'], key: 'theme' },
            { path: 'assets/style/common/_zindex.scss', key: 'zIndex' },
            // { path: 'element-ui/packages/theme-chalk/src/fonts/_font.scss', key: 'iconfont' }
        ];
        this.updateJsVar(scssFileList, './src/utils/customCss.js');
    },
};

// 更新入口js文件 jssdk.js 中的变量
const updateEnterVar = () => {
    let jsPath = `./public/jssdk.js`;
    let cont = fs.readFileSync(jsPath, 'utf-8');
    let arr = cont.split('\n');
    arr[1] = `    const path = '${VUE_PUBLIC_PATH}', env = '${VUE_ENV}', sdkName = '${VUE_APP_SDKNAME}', sdkId = '${sdkId}', ts = ${Date.now()};`;
    fs.writeFileSync(jsPath, arr.join('\n'));
};

// 设置sass变量
fs.writeFileSync('./src/assets/style/common/_sdk.scss', `$sdkId:${sdkId};`);

// 把css写入到customCss.js中，保存为js对象
handleScss2Js.do();

//更新enter中的变量
updateEnterVar();
