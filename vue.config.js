const proxy = require('http-proxy-middleware');
module.exports = {
    devServer : {
        hot: true,//自动保存
        open: true,//自动启动
        port: 8080,//默认端口号
        disableHostCheck: true,
        headers: {
            'Access-Control-Allow-Origin':'*',
        },
        host: '127.0.0.1',
        proxy: {
            '/api':{
                target:'http://sakuyo.cn',
                changeOrigin:true,
                secure:false,
                ws:true,
                pathRewrite:{
                    '^/api':'/api'
                },
            }
        }
    }
}