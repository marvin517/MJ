

cc.Class({
    extends: cc.Component,

    properties: {
        Allmodule:null,
    },

    // use this for initialization
    onLoad: function () {
        cc.root = {};
        cc.root.PreRootNode = this;
        console.log("PreRootNode onLoad !");
        cc.game.addPersistRootNode(this.node); 
        
        this.init();
        
    },
    init:function()
    {
        //替换之前的vv
        cc.vv={};
        cc.vv = require("AllModules");

        cc.vv.GlobalMsg.init();
        cc.vv.NetMgr.init();
        cc.vv.GLGameDataMgr.init();
        
        cc.vv.nodePoolMgr = require("NodePoolMgr");
        cc.vv.nodePoolMgr.init();
        
        cc.dd.nodePoolMgr = cc.vv.nodePoolMgr;

        cc.vv.CusStorage = require("CusStorage");
        cc.vv.CusStorage.init();
		
		cc.vv.global = require("Global");
		
        cc.vv.allRequest = require("AllRequest");
        cc.vv.allRequest.init();
        cc.vv.allRequest.state = 0;

        cc.vv.PomeloNetMgr = require("PomeloNetMgr");
        cc.vv.audioMgr = require("AudioMgr");
        cc.vv.audioMgr.init();
        cc.vv.LoadLocResHandle.init();
    },


    start:function(){        
        console.log('PreRootNode------start------:');
       
       var self = this;
        this._MsgFun = function(msgtype,data)
        {
            self.MssageHandle(msgtype,data);
        };
        cc.vv.GlobalMsg.Register("GameMgrMSG", this._MsgFun);
        
        // if (cc.sys.os == cc.sys.OS_ANDROID || cc.sys.os == cc.sys.OS_IOS) 
        // {
        //     setTimeout(function() {
        //         self.CheckVersion();
        //     }, 100);
        // }
        
    },
    MssageHandle:function(msgtype,data)
    {
        console.log("LMssageHandle msgtype:"+msgtype+","+"parm:"+JSON.stringify(data));
        var self = this;
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.MessageType.checkversion:
            {
                if(cc.sys.os == cc.sys.OS_IOS)
                {
                    if(cc.vv.global.ReviewVersion == false)
                    {
                         setTimeout(function() {
                            self.CheckVersion();
                        }, 100);
                    }
                }
                else
                {
                    setTimeout(function() {
                        self.CheckVersion();
                    }, 100);
                }
            }
            break;

        }
    },

    
    //场景加载完成后的回调
    LoadSceneDoneCB:function()
    {
        console.log("PreRootNode LoadSceneDoneCB !");
        var sceneName = cc.director.getScene().name;
        if(sceneName == 'mjgame' || sceneName == 'mjgame3D' || sceneName == 'niugame'){
            cc.vv.GlobalMsg.SendWithTarget("LoadSceneFinish",cc.vv.GLGameDefine.MessageType.SceneLoadFinish,{});
        }
    },
    //版本检测
    CheckVersion:function()
    {
        // console.log("cc.vv.global.version:"+cc.vv.global.version);
        // if(cc.vv.global.version > "4.5.4")
        // {
        //     console.log("cc.vv.global.version:>"+cc.vv.global.version);
        // }
        // else
        // {
        //     console.log("cc.vv.global.version:<"+cc.vv.global.version);
        // }
        // var SearchPathsAddtag = cc.sys.localStorage.getItem("SearchPathsAdd");
        // cc.vv.global.Debuglog("CheckVersion:CheckVersion:"+SearchPathsAddtag);
        // //检测JS的版本和服务器版本是否一致
        // if(SearchPathsAddtag != 10000)
        // {
        //     //进入基础包下载流程
        //     cc.vv.global.Debuglog("CheckVersionPath:基础包下载流程");
        //     cc.vv.alert.show("提示", "当前版本不兼容，请下载最新版本！",function () {
        //         cc.sys.openURL(cc.vv.global.DownLoadURL);
        //     },true);
        //     return;
        // }
        // else
        // {
        //     cc.vv.global.Debuglog("CSearchPathsAddtag == 10000");
        // }

        this.CheckVersionHotUp();
    },
    //热更检测
    CheckVersionHotUp:function()
    {
        var localVersion = cc.sys.localStorage.getItem("localVersion");
        cc.vv.global.Debuglog("CheckVersionPath:cc.vv.global.severVersion = "+cc.vv.global.severVersion);
        if(cc.vv.global.severVersion != localVersion)
        {
            cc.vv.global.Debuglog("CheckVersionPath:severVersion != localVersion.JSversion ="+cc.vv.global.severVersion);
            //本地版本和服务器版本不一致
            //进入热更流程
            cc.vv.alert.show("提示", "当前版本不是最新的，是否马上更新！",function () {
                cc.vv.global.loadScene("update");
            },true);
        }
        else
        {
            cc.vv.global.Debuglog("CheckVersionPath:cc.vv.global.severVersion == localVersion");
        }
    },
    onDestroy:function(){
        cc.vv.GlobalMsg.Unregister("GameMgrMSG", this._MsgFun);
    },

    /*心跳检测，设定规定时间后进行服务器请求，
    请求成功直接进行下一次心跳，
    请求在规定时间没有回答，则主动进行重连，并且继续进行下一次心跳
    */
    openHeartbeat:function(){
        console.log("openHeartbeat");
        cc.vv.allRequest.heartId = setInterval(this.heartRequest,cc.vv.allRequest.heartbeatTime);
        // setTimeout(cc.root.PreRootNode.heartRequest, cc.vv.allRequest.heartbeatTime);
    },
    heartRequest:function(){
        if (cc.vv.allRequest.isReconnection == false) {
            console.log("Heartbeat false isReconnection : " + cc.vv.allRequest.isReconnection);
            let isReply = false;
            var successFun = function (ret) {
                isReply = true;
                console.log("Heartbeat successFun:" + JSON.stringify(ret));
            };
            //超时回调
            var failFun = function () {
                // isReply = true;
                // console.log("Heartbeat failFun:");
                // cc.vv.allRequest.reconnection();
            }
            var isReconnection = function () {
                console.log("Heartbeat isReconnection:");
                if (!isReply) {
                    console.log("Heartbeat isReconnection  2:");
                    cc.vv.allRequest.activeToReconnection();
                }
            };
                // console.log("c.vv.allRequest.curServer1");
            
            setTimeout(isReconnection, cc.vv.allRequest.heartbeatTime - 2000);
                // console.log("c.vv.allRequest.curServer12");
            
            if(cc.vv.allRequest.curServer == "connect"){
                // console.log("c.vv.allRequest.curServer123");
                cc.vv.allRequest.thirdRequest("connector.netCheckHandler.netCheck", {}, successFun, failFun, cc.vv.allRequest.heartbeatTime - 1000); 
                // console.log("c.vv.allRequest.curServer1234");
            }
        }else{
            console.log("Heartbeat true isReconnection : " + cc.vv.allRequest.isReconnection + " reconUseHeartTimes: " + cc.vv.allRequest.reconUseHeartTimes);
            cc.vv.allRequest.reconUseHeartTimes++;
            if(cc.vv.allRequest.reconUseHeartTimes == 2){
                cc.vv.allRequest.isReconnection = false;
            }
        }
    },
    
});
