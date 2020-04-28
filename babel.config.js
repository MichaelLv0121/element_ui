module.exports = {
    "presets": [
        "@vue/cli-plugin-babel/preset"
    ],
    "plugins": [
        [
            "component",
            {
                "libraryName": "element-ui",
                "styleLibraryName": "theme-chalk"
            }
        ],
        //将路由优化为“路由懒加载”
        "@babel/plugin-syntax-dynamic-import"
    ]
}
