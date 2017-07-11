var utils = require("Utils");
var playerdata = cc.Class({
    extends: cc.Component,
    properties: {
        account:null,
	    userId:null,
		userName:null,
		lv:0,
		exp:0,
		coins:0,                    //金币
		gems:0,                     //房卡、钻石
		sign:0,
        ip:"",
        sex:0,//1man 2woman
        roomData:null,
        headImage:null,
        oldRoomId:null,
        spreaderId:null,//是否绑定邀请码
        isProxy:null,//是否代理，1是代理，0不是
    },
    
    //accout and sign 不清空，重连要用
    reset : function(){
	    this.userId=null;
		this.userName=null;
		this.lv=0;
		this.exp=0;
		this.coins=0;
		this.gems=0;
        this.ip="";
        this.sex=0;
        this.roomData=null;        
        this.oldRoomId=null;
        this.headImage=null;
        this.spreaderId=null;
        this.isProxy = null;
    },
    init:function()
    {
        this.reset();


    },
    setplayerdata:function(data)
    {
        if(ret.code == cc.vv.global.MessageType.NetReLogin)
        {
                    if(ret.code == cc.vv.global.MessageType.NetReLogin){
                    cc.vv.allRequest.state = 13;
                    var pomelo = window.pomelo;
                    pomelo.disconnect();
                    cc.vv.alert.show("提示",ret.errorMessage,function(){
                        // cc.vv.allRequest.reconnection();

                        cc.vv.allRequest.activeToReconnection();
                    });
                }
                else if(ret.code == 300){//登陆时发现自己在线，顶号，需转连之前的connection
                    //先移除重连监听
                    cc.vv.PomeloNetMgr.ListingOff("close",cc.vv.allRequest.ListenOnClose);
                    //断开当前连接，连接至新的connection
                    var pomelo = window.pomelo;
                    pomelo.disconnect();
                    cc.vv.userMgr.shutOffToConnection(ret);
                }else {
                    //self.account = ret.data.account;
                    if(ret.data.userInfo.accountId != null){
                        cc.sys.localStorage.setItem("guest_account", ret.data.userInfo.accountId);
                        self.account = ret.data.userInfo.accountId;
                    }else{
                        cc.sys.localStorage.removeItem("guest_account");
                    }

                    // ///屏蔽下两行后，账号有保存功能能
                    //cc.sys.localStorage.removeItem("guest_account");



                    if (ret.data.weichatAccount != null) {//标志为微信登陆，记录这个字段
                        cc.sys.localStorage.setItem(cc.vv.global.localClientType + "wx_account", ret.data.weichatAccount);
                        self.account = ret.data.weichatAccount;
                    } else {
                        cc.sys.localStorage.removeItem(cc.vv.global.localClientType + "wx_account");
                    }

                    self.headImage = ret.data.userInfo.headImage;                
                    self.userId = ret.data.userInfo.userId;
                    self.sex = ret.data.userInfo.sex;
                    utils.alertObj(ret.data.userInfo.name,"usemgr 101");
                    self.userName = ret.data.userInfo.name;
                    self.coins = ret.data.userInfo.coins;
                    self.gems = ret.data.userInfo.roomCard;//房卡
                    //self.roomData = ret.data.roomid;
                    self.sex = ret.data.userInfo.sex;
                    self.ip = ret.data.IP;
                    self.isProxy = ret.data.userInfo.isProxy;
                    

                    self.spreaderId = ret.data.userInfo.spreaderId;
                    console.log("inviteCode onload spreaderId: " + cc.vv.userMgr.spreaderId);
                    //非重连
                    if (ret.data.addr == "hall") {
                        console.log("ret.data.addr == \"hall\"");
                        
                        //预加载场景，然后进入
                        cc.vv.wc.show("");
                        cc.vv.global.loadScene("hall");
                    }
                    else {
                        var data1 = {
                            roomId: ret.data.userInfo.roomId,
                            seatIndex: ret.data.userInfo.seatIndex,
                            /////九日重连时再发一次定位数据给服务器

                            /////
                        };
                        self.reconnection(data1);
                    }
                }        
            };
            var failFun = function () {
                cc.vv.global.Debuglog("Debuglog:connector.entryHandler.login failFun");
                cc.vv.wc.hide();
                cc.vv.alert.show("提示", "网络连接超时！请检查网络或重启客户端")
                }
            // cc.vv.global.Debuglog("Debuglog:connector.entryHandler.login");
            cc.vv.global.Debuglog("Debuglog:connector.entryHandler.login Login");
            cc.vv.wc.show("");
            // 加上 客户端类型
            data.clientType = cc.vv.global.localClientType;
            //加上 客户端 版本号 第一个是基础版本号，第二个是升级版本号
            data.clientVersion = cc.vv.global.version;
            data.upgradeVersion = cc.sys.localStorage.getItem("localVersion");
            cc.vv.allRequest.thirdRequest("connector.entryHandler.login", data, onLogin, failFun);
    }
});
module.exports = new playerdata();
