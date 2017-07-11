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
    setplayerdata:function(ret)
    {
        
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
    }
});
module.exports = new playerdata();
