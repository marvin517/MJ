var AllRequest = cc.Class({
    extends: cc.Component,
    properties: {
        state:0,
        host:null,
        port:null,
        handlers:null,
    },

    init:function()
    {
        this.handlers = {};
    },
    //param： route:请求路由  data:发送的数据  successFun:成功回调（有回复即为成功）  failFun:失败回调   delaytime:每一次的时间间隔
    thirdRequest: function (route, data, successFun, failFun, delaytime) {
        var isReply = false;
        var delay = (delaytime == null) ? 10000 : delaytime;

        var fn = function () {
            if (isReply)
                return;
            if (failFun != null) {
                successFun = null;
                failFun();
            }
        };
        cc.vv.PomeloNetMgr.RequestWithParams(route, data, function (ret) {
            isReply = true;
            if (successFun != null) {
                successFun(ret);
            }
        });
        setTimeout(fn, delay);
    },

    cleanData : function(){
        cc.vv.gameNetMgr.roomId = null;
        cc.vv.userMgr.reset();
        cc.vv.gameNetMgr.resetAllData();
		cc.vv.replayMgr.clear();
        //cc.vv.gameNetMgr.allHead = [];
    },

    disconnection:function(){
        try {
            let pomelo = window.pomelo;
            pomelo.disconnect();//断开连接
        } catch (e) {
            cc.vv.allRequest.reconnection();
        }
        cc.vv.allRequest.curServer = null;
    },

    //connect to gate
    connectGate : function(){
        console.log("allrequest.  connectGate  begin state:" + cc.vv.allRequest.state);
        cc.vv.allRequest.state += 1;
        var isReply = false;//是否收到回复

        var failFun = function () {
            console.log("allrequest.  connectGate  failFun");
            //收到回复，打断请求
            if (isReply)
                return;
            //回调置空
            successFun = null;
            cc.vv.GlobalMsg.Send("GameMgrMSG_Req_Cb_failed",cc.vv.GLGameDefine.MessageType.initpomeloFailed);
            cc.vv.allRequest.state = cc.vv.allRequest.state < 6 ? 0 : 6;
            if (cc.vv.allRequest.state == 0)
                cc.vv.peralert.show("提示", "连接超时，请检查网络后，重启客户端以重试",function(){
                    cc.vv.global.restart();
                });
            if (cc.vv.allRequest.state == 6){
                cc.vv.allRequest.clickedToRecon();
            }
        };

        var successFun = function () {
            console.log('PomeloNetMgr.initPomelo sucess!!!  first time');
            cc.vv.allRequest.curServer = "gate";
            isReply = true;
            cc.vv.allRequest.state += 1;
            //cc.vv.GlobalMsg.Send("GameMgrLMSG",cc.vv.GLGameDefine.MessageType.initpomeloSucess);
            cc.vv.GlobalMsg.SendMsg(cc.vv.GLGameDefine.MessageType.initpomeloSucess);
        };
        cc.vv.PomeloNetMgr.initPomeloNetMgr({
            host: cc.vv.global.GateIP,
            port: cc.vv.global.GatePort,
            log: true}, successFun,failFun);

    },
    //connectConnector
    connectConnector: function (data) 
    {
        var isReply = false;//是否收到回复
        console.log("allrequest.  connectConnector  begin");
        var successFun = function()
        {
            isReply = true;
            cc.vv.GlobalMsg.Send("GameMgrLMSG",cc.vv.GLGameDefine.MessageType.connectorSucess);
        };
        var failFun = function()
        {
            if (isReply)
                return;
            cc.vv.GlobalMsg.Send("GameMgrLMSG",cc.vv.GLGameDefine.MessageType.connectorFailed);
        };
        var Connectordata = {
            host: data.host,
            port: data.port,
            log: true
        };
        pomelo.init(Connectordata, successFun);//连接服务器
        setTimeout(failFun, 10000);
    },

    //事件监听
    addHandler:function(event,fn)
    {
        if(this.handlers == undefined)
        {
            this.handlers = {};
        }
        if(this.handlers[event]){
            console.log("event:" + event + "' handler has been registered.");
            return;
        }

        var handler = function(data){
            if(event != "disconnect" && typeof(data) == "string"){
                try
                {
                    data = JSON.parse(data);
                }
                catch (e) {
                    console.log(event + "(" + typeof(data) + "):" + (data? data.toString():"null"));
                }
            }
            fn(data);
        };
        
        this.handlers[event] = handler; 
        var pomelo = window.pomelo;
        if(pomelo){
            //console.log("register:function " + event);
            pomelo.on(event,handler);
        }
    },

    //离线监听函数，
    ListenOnClose: function () {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ListenOnClose!!!!!!!!!!!!");
    },
    ListenOnDisconnect: function () {
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!ListenOnDisconnect!!!!!!!!!!!!");
    },
});
module.exports = new AllRequest();