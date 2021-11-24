
export default {
    name: "",
    props: {},
    data() {
        return {
            sdkId: '', // 插件css变量
            sdkName: '', // 插件js变量
        };
    },
    watch: {
    },
    created() {
        this.sdkId = process.env.VUE_APP_SDKID;
        this.sdkName = process.env.VUE_APP_SDKNAME;
    },
    mounted() { },
    methods: {
        // 补全样式
        cls(className) {
            return `${this.sdkId}-${className}`;
        }
    },
    computed: {
    },
    components: {},
};