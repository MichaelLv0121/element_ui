module.exports = {
    devServer: {
        open: true,
        port: 7777
    },
    chainWebpack: config => {

        //生产环境
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js');

            config.set('externals', {
                vue: 'Vue',
                'vue-router': 'VueRouter',
                axios: 'axios',
                lodash: '_',
                echarts: 'echarts',
                nprogress: 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            });

            config.plugin('html').tap(args => {
                args[0].isProduction = true;
                return args;
            });
        });

        //开发环境
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js');

            config.plugin('html').tap(args => {
                args[0].isProduction = false;
                return args;
            });
        });

    }
}
