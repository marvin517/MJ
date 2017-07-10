var PomeloNetMgr = cc.Class({
    extends: cc.Component,

    properties: {
        route:'gate.gateHandler.queryEntry',
        uid:"uid",
        rid:"rid",
        username:"username",
        pomelo:null,
        Global:null,
        dataEventHandler:null,
    },

    //初始化pomelo
    //传入JSON数据，包含IP和端口
    initPomeloNetMgr:function(params,fun,funf)
    {
        pomelo = window.pomelo;
        pomelo.init({
            host: params.host,
            port: params.port,
            log: true}, fun);
        setTimeout(funf, 10000); 
    },
    
    //传入一个json，传入参数，请求网络协议
    //json解析，传入json保证Key值：route，data，fun
    requestWithJson:function(params)
    {
        pomelo.request(params.route,params.data,params.fun);    
    },
    //传入三个参数，作为发起请求的参数
    //route:服务器路由信息
    //data:发给服务器的json数据
    //回调函数
    RequestWithParams:function(route,data,fun)
    {
        pomelo.request(route,data,fun);    
    },
    //监听：
    //funName:监听Key值
    //监听回调函数
    ListingOn:function(funName,fun)
    {
        pomelo.on(funName,fun);
    },

    //取消监听回调函数
    ListingOff:function(funName,fun)
    {
        pomelo.off(funName,fun);
    },


});
module.exports = new PomeloNetMgr();