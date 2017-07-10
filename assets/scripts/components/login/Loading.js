cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel:cc.Label,
        _stateStr:'',
        _progress:0.0,
        //_splash:null,
        _isLoading:false,
        _isNoNeedLoading:false,
    },

    // use this for initialization
    onLoad: function () {
        this.init();
    },
    init:function()
    {
        try {
            if(!cc.sys.isNative && cc.sys.isMobile){
                var cvs = this.node.getComponent(cc.Canvas);
                cvs.fitHeight = true;
                cvs.fitWidth = true;
            }
            
            var size = cc.director.getVisibleSize();
            console.log("start size : " + size + " x : " + size.width + " y " + size.height );
            this.node.scaleX = size.width / 1280;
            this.node.scaleY = size.height / 720;
            
            cc.director.getScene().name = "loading";
            console.log('LoadingLogic------onLoad------:');
            //fm change
            this.initLink();
            this.tipLabel.string = this._stateStr;

        } catch (error) {
            cc.vv.global.ShowErrorMsg("Loading 17 Failed:"+JSON.stringify(error.message));
        }
    },
    initLink:function(){
        var self = this;
        self._stateStr = "正在连接服务器";

        
        cc.vv.PomeloNetMgr.ListingOn("close",cc.vv.allRequest.ListenOnClose);
        cc.vv.PomeloNetMgr.ListingOn("disconnect",cc.vv.allRequest.ListenOnDisconnect);

        cc.args = this.urlParse();
        cc.eventManager.addCustomListener(cc.game.EVENT_HIDE, function(){
            //处理游戏进入后台的情况
            console.log('处理游戏进入后台的情况 cc.game.EVENT_HIDE');
            if (cc.vv.audioMgr) {
                cc.vv.audioMgr.pauseAll();
                //进入后台，上一个场景置为空
                cc.vv.global.lastScene = null;
            }
        });
        cc.eventManager.addCustomListener(cc.game.EVENT_SHOW, function(){
            //处理返回游戏的情况
            console.log('处理返回游戏的情况 cc.game.EVENT_SHOW');
            if (cc.vv.audioMgr) {
                cc.vv.anysdkMgr.autoEnterRoomFun();
                cc.vv.audioMgr.resumeAll();
            }
        });

        cc.vv.allRequest.connectGate(function () { self.checkVersion() }, function () { self._stateStr = ""; });
    },


    //猜测是网页启动的客户端，截取一定的参数作为自己的账号account
    urlParse:function(){
        try {
            var params = {};
            if(window.location == null){
                return params;
            }
            var name,value; 
            var str=window.location.href; //取得整个地址栏
            var num=str.indexOf("?") //indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置
            str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
            
            var arr=str.split("&"); //各个参数放到数组里
            for(var i=0;i < arr.length;i++){ 
                num=arr[i].indexOf("="); 
                if(num>0){ 
                    name=arr[i].substring(0,num);
                    value=arr[i].substr(num+1);
                    params[name]=value;
                } 
            }
            return params;
        } catch (error) {
            cc.vv.global.ShowErrorMsg("LoadingLogic 204 Failed:"+JSON.stringify(error.message));
        }
        
    },
    
    checkVersion: function () {
        try {
            var self = this;
            var successFun = function (ret) {
                cc.vv.wc.hide();
                if (ret.code == 500) {
                    self._stateStr = "";
                    //cc.vv.alert.show("提示", "检查版本号信息失败,请检查网络环境，重启客户端以重试");
                    cc.vv.alert.show("提示",ret.errorMessage);
                }
                else {
                    console.log("checkVersion ret.data:"+JSON.stringify(ret.data));
                    // 存储分享链接
                    if (cc.vv != null) {
                        cc.vv.global.ShareURL_Android = ret.data.ShareURL_Android;
                        cc.vv.global.ShareURL_IOS = ret.data.ShareURL_IOS;
                        cc.vv.global.DownLoadURL = ret.data.DownLoadURL;
                        if(ret.data.heartBeatTime != null && ret.data.heartBeatTime != "undefined"){              
                            cc.vv.allRequest.heartbeatTime = ret.data.heartBeatTime * 1000;
                            console.log("heartbeatTime 赋值成功，赋值为：" + cc.vv.allRequest.heartbeatTime);
                        }
                    }

                    cc.vv.SI = ret.data;
                    var TPayType = ret.data.payType;
                    cc.vv.global.SetPayType(ret.data.payType,ret.data.androidPayType);
                    //cc.vv.global.PayType = ret.data.payType;
                    console.log("cc.vv.global.PayType:"+cc.vv.global.PayType);
                                    ////九日专为windows测试

                    var localVersion = cc.vv.CusStorage.getItem("localVersion");

                    // if(cc.sys.os == cc.sys.OS_WINDOWS)
                    // {
                    //     //cc.sys.localStorage.setItem("localVersion",ret.data.version)
                    //     localVersion = null;
                    // }
                    if(localVersion == null)
                        localVersion = cc.vv.global.version;
                    //----------------------------version check add by jcz---------------------
                    var serversion=JSON.stringify(ret.data.version); 
                    cc.vv.global.severVersion = ret.data.version;
                    var cliversionr=JSON.stringify(localVersion);
                    console.log("version cliversionr:"+localVersion);
                    serversion = serversion.split("\"").join("");
                    cliversionr = cliversionr.split("\"").join("");

                    var svarr=serversion.split(".");
                    var cvarr=cliversionr.split(".");

                    for(var i = 0; i < svarr.length; i++)
                    {
                        console.log("version for svarr:"+svarr[i]+",i:"+i);
                    } 
                    for(var i = 0; i < cvarr.length; i++)
                    {
                        console.log("version for cvarr:"+cvarr[i]+",i:"+i);
                    } 
                    if(ret.data.version === cliversionr)
                    {
                        cc.vv.CusStorage.setItem("localVersion",ret.data.version);
                        //完全一致，直接进入登陆
                        cc.vv.allRequest.setGateInfoAndThen(ret.data);
                    }
                    else
                    {
                        if (svarr[0] < cvarr[0])//服务器大版本号 (低于)< 客户端大版本号，审核状态，用游客登陆
                        {
                            cc.vv.global.ReviewVersion = true;

                            cc.vv.global.SetPayType(0,ret.data.androidPayType);
                            cc.vv.CusStorage.removeItem(cc.vv.global.localClientType + "wx_account");
                            cc.vv.global.guest = true;
                            cc.vv.allRequest.setGateInfoAndThen(ret.data);
                        }
                        else if(svarr[0] == cvarr[0])//大版本一致
                        {
                            self.GotoUpdate(ret.data.version);
                        }
                        else//客户端大版本低于服务器，弹出强制更新：IOS进入Appstore，android：FIR
                        {
                            try {
                                console.log("AndroidDownload AndroidDownload:"+ret.data.AndroidDownload);
                                if (cc.sys.os == cc.sys.OS_ANDROID)
                                {
                                    if(ret.data.AndroidDownload == 1)
                                    {
                                        self.ShowDownload();
                                    }
                                    else
                                    {
                                        self.GotoUpdate(ret.data.version);
                                    }
                                }
                                else
                                {
                                    console.log("version check 3-------------");
                                    self.ShowDownload();
                                }
                            } catch (error) {
                                cc.vv.global.ShowErrorMsg("AndroidDownload Failed:"+JSON.stringify(error.message),cc.vv.GLGameDefine.ActionType.loadlogin);
                            }
                        }
                    }

                    //除了ios和android都是游客登陆
                    if(cc.sys.os != cc.sys.OS_ANDROID && cc.sys.os != cc.sys.OS_IOS){
                        cc.vv.CusStorage.removeItem(cc.vv.global.localClientType + "wx_account");
                        cc.vv.global.guest = true;
                    };
                }
            };
            var failFun = function () {
                cc.vv.alert.show("提示", "连接超时，请检查网络环境，重启客户端以重试", function () 
                {
                    cc.game.restart();
                });
                self._stateStr = "";
            }
            self._stateStr = "正在连接服务器";
            cc.vv.allRequest.thirdRequest("gate.gateHandler.queryEntry", {clientType : cc.vv.global.localClientType}, successFun, failFun);
        } catch (error) {
            cc.vv.global.ShowErrorMsg("LoadingLogic 232 Failed:"+JSON.stringify(error.message));
        }
        
    },
    GotoUpdate:function(version)
    {
        try {
            cc.vv.PomeloNetMgr.ListingOff("close",cc.vv.allRequest.ListenOnClose);
            cc.vv.PomeloNetMgr.ListingOff("disconnect",cc.vv.allRequest.ListenOnDisconnect);
            cc.vv.global.loadScene("update");

            cc.vv.global.version = version;
            if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) 
            {
            }
            else
            {
                cc.vv.CusStorage.setItem("localVersion",version);
            }
        } catch (error) {
            cc.vv.global.ShowErrorMsg("AndroidDownload Failed:"+JSON.stringify(error.message),cc.vv.GLGameDefine.ActionType.restart);
        }

    },
    ShowDownload:function()
    {
        try {
            var self = this;
            cc.vv.CusStorage.removeItem("localVersion");
            self._stateStr = "";
            cc.find("Canvas/alertBefore").active = true;
        } catch (error) {
            cc.sys.openURL(cc.vv.global.DownLoadURL);
        }
        
    },
    
    onBtnDownloadClicked:function(){
        cc.sys.openURL(cc.vv.global.DownLoadURL);
    },
    
    //加载资源，准备
    startPreloading:function(){
        try {
            this.initMgr();
            this._stateStr = "正在加载资源，请稍候";
            this._isLoading = true;
            self.onLoadComplete();
        } catch (error) {
            cc.vv.global.ShowErrorMsg("LoadingLogic 513 Failed:"+JSON.stringify(error.message));
        }
    },
    
    //进入登陆界面(或者重连登录后进入大厅)
    onLoadComplete:function(){
            this._isLoading = false;
            this._stateStr = "准备登陆";
            cc.vv.global.loadScene("login");
            cc.vv.GlobalMsg.Send("GameMgrMSG",cc.vv.GLGameDefine.MessageType.checkversion,cc.vv.global.severVersion);
            cc.loader.onComplete = null;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        try {
            if(this._stateStr.length == 0){
                return;
            }
            this.tipLabel.string = this._stateStr + ' ';
            if(this._isLoading){
                this.tipLabel.string += Math.floor(this._progress * 100) + "%";   
            }
            else{
                var t = Math.floor(Date.now() / 1000) % 4;
                for(var i = 0; i < t; ++ i){
                    this.tipLabel.string += '.';
                }            
            }
        } catch (error) {
            cc.vv.global.ShowErrorMsg("LoadingLogic 558 Failed:"+JSON.stringify(error.message));
        }
        
    },
});