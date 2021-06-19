module.exports = {
    //合并进项目js文件
    configureWebpack:{
        // 解决路径相关
        resolve:{
            alias:{
                //路径起别名
                'assets': '@assets',
                'common': '@common',
                'components': '@components',
                'network': '@network',
                'views': '@views',
            }
        }
    }
}