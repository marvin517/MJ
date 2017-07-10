var Global = cc.Class({
    extends: cc.Component,
    statics: {
        GateIP:"47.93.241.225",//47.94.97.96 外网 182.61.35.87  老项 192.168.1.130  192.168.1.144  123.56.3.119   秦瑞：192.168.0.120////外网测试IP：47.93.241.225
        ///测试外网	47.93.241.225      //强哥192.168.0.101  192.168.1.144
		GatePort:3014,
        isstarted:false,
        netinited:false,
        userguid:0,
        nickname:"",
        money:0,
        lv:0,
        roomId:0,
        palyerid:"10021",
        playername:"empty",
        playerrid:"100000",
        version:"3.5.2",
        severVersion:"",
        Debug:true,
        ReviewVersion:false,     //是否为审核版本
        PayType:0,
        OldVersion:false,
        guest:false,
        // 收到的回放记录
        historyRecord:[],
        // 分享给朋友或朋友圈的下载链接
        ShareURL_Android:"",
        ShareURL_IOS:"",
        DownLoadURL:"",
        // 麻将名称
        gameName:"大富翁达州",
        // 电池
        Battery:null,
        // 座位（已备GameNetMgr.js中的seats为null时使用
        seats : [],
        lastScene:null,     //记录上一个场景，用于魔窗拉起进入房间， 如果进入后台，上一个场景置为空
        inviteID:"",
        teahouseID:"",
        inviteRoomId:"",
        //邀请码信息
        _inviteInfo:{
            weChat:null,
            diamonds:null,
            persent:null,
        }, //weChat客服微信，diamonds ：钻石，persent ：赠送百分比

        //建议把消息枚举都写在次，一遍后期消息检测
        //消息枚举
        MessageType:{
            NetError:500,
            NetSucess:200,
            NetReLogin:400,
        },
        //物品类型
		GoodsType:{
            vip:0,              //vip
            goldcoins:1,        //金币
            diamonds:2,         //钻石
            fixsigncard:3,      //补签卡
            changeNameCard:4,   //改名卡
            monthcard:5,        //月卡
            loudspeaker:6,      //大喇叭
            other:100,          //其他，礼包等
        },
		//本地 客户端 类型
        localClientType : "dzmj",

        //游戏类型
        GameType:{
            CDMJ:"xzdd", //成都麻将
            NMMJ:"eeds", //鄂尔多斯内蒙麻将
            GoldsMJ:"dzmjGoldCoinsRoom",//金币场
        },

        //已经选择的游戏类型
        selectGameTypeId:10002,    //10000 成麻 10001 鄂尔多斯 10002达州 //////20000金币场


        Is3DGame:false,
        ///////////////////////////////////////////////////////////////////////////////////////////////////////
        //购买相关数据
        BuyID:0,                //当前购买的商品ID
        GoodsList:{},           //商品数据列表


        SetGoodsList:function(data)
        {
            GoodsList = data;
        },
        GetGoodsByID:function(id)
        {
            console.log("GetGoodsByID goods:"+JSON.stringify(this.GoodsList));
            for(var i = 0;i < Object.keys(this.GoodsList).length;i++)
            {
                console.log("goods:"+JSON.stringify(this.GoodsList[i]));
            }
            if(this.GoodsList[id] == null || this.GoodsList[id] == "undefined")
            {
                cc.error("this.GoodsList[id] == null!");
                return null;
            }
            return this.GoodsList[id];
        },
        ///////////////////////////////////////////////////////////////////////////////////////////////////////

        
        init:function()
        {
            var self = this;
            this.ANDROID_API = "com/zcyx/dzmj/WXAPI";
            this.Is3DGame = true;
            // self.MessageType.NetError = 500;
            // self.MessageType.NetSucess = 200;
        },
        UpdateSucess:function()
        {
            console.log("UpdateSucess cc.vv.global.version:"+JSON.stringify(cc.vv.global.version));
            cc.sys.localStorage.setItem("localVersion",cc.vv.global.version);
        },

        //设置paytype
        SetPayType:function(IOStype,AnType)
        {
            if(cc.sys.os == cc.sys.OS_IOS)
            {
                this.PayType = IOStype;
            }
            else if (cc.sys.os == cc.sys.OS_ANDROID)
            {   
                this.PayType = AnType;
                if(AnType == null || AnType == undefined)
                {
                    this.PayType = 3;
                }
                
            }
            else if(cc.sys.os == cc.sys.OS_WINDOWS)
            {
                this.PayType = AnType;
                if(AnType == null || AnType == undefined)
                {
                    this.PayType = 3;
                }
            }
        },

        Debuglog:function(data)
        {
            if(cc.sys.os == cc.sys.OS_IOS)
            {
                jsb.reflection.callStaticMethod("ThirdPartyIOS", "DebugLogIOS:", JSON.stringify(data));
            }
            else if (cc.sys.os == cc.sys.OS_ANDROID)
            {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "debuglog", "(Ljava/lang/String;)V", JSON.stringify(data));
            }
            else if(cc.sys.os == cc.sys.OS_WINDOWS)
            {
                console.log("Debuglog:"+JSON.stringify(data));
            }
        },
        DecodeBase64:function(datastr)
        {
            //datastr=null;
            var buf = null;
            try {
                
                buf = new Buffer(datastr, 'base64');
                var str = this.CusSubString(buf.toString(),8)
                this.Debuglog("DecodeBase64 str:"+str);
            } catch (error) {
                //cc.vv.global.ShowErrorMsg("DecodeBase64 Failed:"+JSON.stringify(error.message));
                cc.vv.global.ShowErrorMsg("DecodeBase64 Failed:"+JSON.stringify(error.message),cc.vv.GLGameDefine.ActionType.reconnect);
                return "";
            }            
            return str;//buf.toString();
        },
        DecodeBase64ByL:function(datastr,length)
        {
            try {
                var buf = new Buffer(datastr, 'base64');
            
                var str = this.CusSubString(buf.toString(),length);//buf.toString().substring(0,length);

                this.Debuglog("DecodeBase64 str:"+str);
                return str;//buf.toString();
            } catch (error) {
                cc.vv.global.ShowErrorMsg("DecodeBase64ByL Failed:"+JSON.stringify(error.message),cc.vv.GLGameDefine.ActionType.reconnect);
                return "";
            }
            
        },

        //////////////////////////////////////////////////////////
        //长度获取
        ////截取指定长度的字符串
        CusSubString: function (str, n) 
        {
            try {
                var r=/[^\x00-\xff]/g;//new RegExp ("/[^\x00-\xff]/g"); 
                if(str.replace(r,"mm").length<=n){return str;}

                var m=Math.floor(n/2);
                for(var i=m;i<str.length;i++){
                    if(str.substr(0,i).replace(r,"mm").length>=n){
                        return str.substr(0,i);
                    }
                }
                return str;
            } catch (error) {
                cc.vv.global.ShowErrorMsg("Debuglog 219 Failed:"+JSON.stringify(error.message));
            }
            
        },
        
        loadScene: function (scene) {
            //针对3D场景做特殊跳转处理
            if(scene == "mjgame" || scene == "mjgame3D")
            {
                if(this.Is3DGame == true)
                {
                    scene = "mjgame3D";
                }
                else
                {
                    scene = "mjgame";

                }
            }
            cc.sys.garbageCollect();

            console.log("loadScene:" + JSON.stringify(scene));
            cc.vv.global.lastScene = cc.director.getScene().name;
            cc.director.loadScene(scene);
        },
        ShowErrorMsg:function(errorstr,action)
        {
            try {
                cc.vv.peralert.show("提示", JSON.stringify(errorstr),function()
                {
                    switch(action)
                    {
                        case cc.vv.GLGameDefine.ActionType.reconnect:
                        {
                           cc.vv.allRequest.activeToReconnection();
                        }
                        break;
                        case cc.vv.GLGameDefine.ActionType.loadhall:
                        {
                            var sceneName = cc.director.getScene().name;
                            cc.vv.global.loadScene("hall");
                        }
                        break;
                        case cc.vv.GLGameDefine.ActionType.loadgame:
                        {
                            var sceneName = cc.director.getScene().name;
                            cc.vv.global.loadScene("mjgame");
                            
                        }
                        break;
                        case cc.vv.GLGameDefine.ActionType.loadlogin:
                        {
                            var sceneName = cc.director.getScene().name;
                            cc.vv.global.loadScene("login");
                        }
                        break;
                        case cc.vv.GLGameDefine.ActionType.restart:
                        {
                            cc.game.restart();
                        }
                        break;
                        default: {
                            cc.error("errorstr");
                        }
                    }
                },true);
            } catch (error) {
                cc.error("ShowErrorMsg error");
            }
        },

    },

   

    
});