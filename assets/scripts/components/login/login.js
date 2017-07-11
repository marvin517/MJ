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
