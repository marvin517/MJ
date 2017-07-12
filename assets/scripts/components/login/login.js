var BaseComponent = require("BaseComponent");
cc.Class({
    extends: BaseComponent,

    properties: {

    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        setTimeout(function() {
            console.log("login RegisterListener:");
            //self.RegisterListener();
            cc.vv.GlobalMsg.AddObserver(self);
            self.SenedAllMsg();
        }, 50);
    },
    //持续发送
    SenedAllMsg:function()
    {
        cc.vv.allRequest.connectGate();
    },

    MssageHandle:function(msgtype,parm)
    {
        var self = this;
        console.log("login msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.MessageType.ButtonClick:
            {
                console.log("data:"+parm);
                self.BTMssageHandle(parm);
            }
            break;
            case cc.vv.GLGameDefine.MessageType.initpomeloSucess:                      //initpomelo登陆成功
            {
                console.log("msgtype:initpomeloSucess:"+msgtype+","+"parm:"+JSON.stringify(parm));
                cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.LoginqueryEntry,{clientType : cc.vv.global.localClientType});
            }
            break;
            case cc.vv.GLGameDefine.MessageType.gatequeryEntrySuc:                      //connectGate登陆成功
            {
                console.log("msgtype:gatequeryEntrySuc:"+msgtype+","+"parm:"+JSON.stringify(parm));
                console.log("msgtype:gatequeryEntrySuc:GateIP:"+JSON.stringify(parm.data.host));
                console.log("msgtype:gatequeryEntrySuc:GatePort:"+JSON.stringify(parm.data.port));
                cc.vv.allRequest.connectConnector({
                    host: parm.data.host,
                    port: parm.data.port,
                    log: true});
            }
            break;
            case cc.vv.GLGameDefine.MessageType.connectorSucess:                      //connectconnector登陆成功
            {
                console.log("msgtype:connectorSucess:"+msgtype+","+"parm:"+JSON.stringify(parm));
            }
            break;
            case cc.vv.GLGameDefine.MessageType.loginloginsuc:
            {
                console.log("msgtype:loginloginsuc:"+msgtype+","+"parm:"+JSON.stringify(parm));
                
                cc.vv.global.loadScene("hall");
            }
            break;
            default:
            break;
        }
    },
    BTMssageHandle:function(BtnType)
    {
        switch(BtnType)
        {
            case cc.vv.GLGameDefine.BTNMsgType.login_Guestlogin:
            {
                this.guestAuth();
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.login_wxlogin:
            {

            }
            break;
            
            default: {
                cc.log("unkown BtnType: ", BtnType);
            }
        }
    },
    //登陆成功,获取登陆后的数据
    loginsucess:function(ret)
    {
        if(ret.code == cc.vv.global.MessageType.NetReLogin)
        {
            //发送NetReLogin消息
            // cc.vv.allRequest.state = 13;
            // var pomelo = window.pomelo;
            // pomelo.disconnect();
            // cc.vv.alert.show("提示",ret.errorMessage,function()
            // {
            //     cc.vv.allRequest.activeToReconnection();
            // });
        }
        else if(ret.code == 300){//登陆时发现自己在线，顶号，需转连之前的connection
            //先移除重连监听
            // cc.vv.PomeloNetMgr.ListingOff("close",cc.vv.allRequest.ListenOnClose);
            // //断开当前连接，连接至新的connection
            // var pomelo = window.pomelo;
            // pomelo.disconnect();
            // cc.vv.userMgr.shutOffToConnection(ret);
        }else 
        {
            cc.vv.playerdata.setplayerdata(ret);
            //非重连
            if (ret.data.addr == "hall") 
            {
                console.log("ret.data.addr == \"hall\"");
                //预加载场景，然后进入
                cc.vv.wc.show("");
                cc.vv.global.loadScene("hall");
            }
            else 
            {
                var data1 = {
                    roomId: ret.data.userInfo.roomId,
                    seatIndex: ret.data.userInfo.seatIndex,
                };
                self.reconnection(data1);
            }
        }
    },
    //游客：检测本地是否有存储 account，如果没有 用当前时间生成，向服务器提交查询这个账号，没有则创建
    guestAuth:function(){
        var self = this;
        var account = cc.sys.localStorage.getItem("guest_account");
        var data = {
                sign     : 1,
                os       : cc.sys.os,
                account  : account,                
                password : null,
                clientType:cc.vv.global.localClientType,
                clientVersion : cc.vv.global.version,
                upgradeVersion:"",
            };
        self.login(data);
    },

    //登陆
    login:function(data){
        
        data.upgradeVersion = cc.sys.localStorage.getItem("localVersion");
        cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.Loginlogin, data);
    },

    onDestroy:function()
    {
        //this.UnRegisterListener();
        cc.vv.GlobalMsg.RemoveObserver(this);
    },





});
