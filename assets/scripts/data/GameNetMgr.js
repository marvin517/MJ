var utils = require("Utils");
var GameNetMgr = cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
        roomId:null,
        createTime:null,
        maxNumOfGames:0,
        numOfGames:0,
        numOfMJ:0,
        seatIndex:-1,
        seats:[],
        turn:-1,
        button:-1,
        dingque:-1,
        chupai:-1,
        isDingQueing:false,
        isHuanSanZhang:false,
        gamestate:"",
        isOver:false,
        dissoveData:null,
        houseOwnerId:null,
        leftCardsNum:[],
        seatsIsZimo:[],
        chupaiCount:0, //转轮子出牌计数
        chiCount:0,//转轮子吃计数
        pengCount:0, //转轮子碰计数
        gangCount:0,//转轮子杠计数
        conf: null,
        curaction:null,
        allHead:[],//所有头像保存，（userid + 头像精灵 + url）
        preHeadInfo:[],//所有准备下载的头像资料的存放（userid + url）
        useHeadInfo:[],//正在下载的头像（userid + url）
        isFinishDownloadHead:true,//是否完成头像下载
        guestHead:null,//游客默认头像

        teaHouseId:null,
        teaHouseData:null,
        // 聊天记录数据
        _chatLog:[],

        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    //fm add 上方所有数据都清空，如果添加，请加进来，下方注释了的为不需要清空的
    resetAllData:function(){
        //dataEventHandler:null,    //此项为监听必须，不可清空
        this.roomId = null,
        this.maxNumOfGames = 0,
        this.numOfGames = 0,
        this.numOfMJ = 0,
        this.seatIndex = -1,
        this.seats = [],
        this.turn = -1,
        this.button = -1,
        this.dingque = -1,
        this.chupai = -1,
        this.isDingQueing = false,
        this.isHuanSanZhang = false,
        this.gamestate = "",
        this.isOver = false,
        this.dissoveData = null,
        this.houseOwnerId = null,
        this.leftCardsNum = [],
        this.seatsIsZimo = [],
        this.chupaiCount = 0,
        this.chiCount = 0,
        this.pengCount = 0;
        this.gangCount = 0;
        this.conf = null,
        this.curaction = null;
        this._chatLog=[];
        // allHead:[],//所有头像保存，（userid + 头像精灵 + url）    //头像功能是完整的循环，建议不要清空
        // preHeadInfo:[],//所有准备下载的头像资料的存放（userid + url）
        // useHeadInfo:[],//正在下载的头像（userid + url）
        // isFinishDownloadHead:true,//是否完成头像下载
        // guestHead:null,//游客默认头像
    },

    getGuestHead: function () {
        var self = this;
        console.log("我加载------------------默认头像成功---------");
        // cc.loader.loadRes("textures/images/public_ui", cc.SpriteAtlas, function (err, atlas) {
        //     var frame = atlas.getSpriteFrame('head_img_female');
        //     self.guestHead = frame;
        //     console.log("我加载--------------------------------------------------------------------------默认头像成功了");
        //     console.log("我加载--------------------------------------------------------------------------默认头像成功了" + JSON.stringify(self.guestHead));
        // });
        cc.loader.loadRes("textures/public/guestHead", cc.SpriteFrame, function (err, spriteFrame) {
            self.guestHead = spriteFrame;
            //self.uiitemicon = spriteFrame;new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height)),
        });
    },
    
    reset:function(){
        this.turn = -1;
        this.chupai = -1,
        this.dingque = -1;
        this.button = -1;
        this.gamestate = "";
        this.dingque = -1;
        this.isDingQueing = false;
        this.isHuanSanZhang = false;
        this.curaction = null;
        //this.houseOwnerId = null;
        var seats = this.getSeats();
        for(var i = 0; i < seats.length; ++i){
            seats[i].holds = [];
            seats[i].folds = [];
            seats[i].tingStatus = -1; //重连tingStatus由原来的true false 改为 0 、1：不管  2：出牌后必须有叫  3：听了
            seats[i].chis = [];
            seats[i].pengs = [];
            seats[i].angangs = [];
            seats[i].diangangs = [];
            seats[i].wangangs = [];
            seats[i].dingque = -1;
            seats[i].ready = false;
            seats[i].hued = false;
            seats[i].huanpais = null;
            seats[i].huedPai = -1;
            seats[i].mammonCard = [];
            seats[i].trusteeship_state = false;
            //fm add 蹲拉跑3项
            seats[i].dunOrLa = false;
            seats[i].pao = false;
            //是否选择蹲拉跑
            seats[i].chooseDunLaPao = false;

            this.huanpaimethod = -1;

            seats[i].tingKind = -1;  //this.tingKind = -1;        //0：吃，1：碰，2：杠 
        }
        this.seats = seats;
        cc.vv.global.seats = seats;

        for(var i = 0; i < this.seatsIsZimo.length; ++i){
            this.seatsIsZimo[i] = false;
        }
        this.leftCardsNum = [];
        this.chupaiCount = 0;
        this.chiCount = 0;
        this.pengCount = 0;
        this.gangCount = 0;

    },

    resetseats:function(){
        this.seats = [];
        cc.vv.global.seats = [];
    },

    //4个玩家座位数据
    setseats: function (data) {
        console.log("setseats:" + JSON.stringify(data));
        for (var i = 0; i < data.length; i++) {
            cc.vv.gameNetMgr.seats.push({
                userid: data[i].userid,
                score: data[i].score,
                name: data[i].name,
                online: data[i].online,
                ready: data[i].ready,
                seatindex: data[i].seatindex,
                ip: data[i].ip,
                headImage:data[i].headImage,
                sex:data[i].sex,
                coins:data[i].coins,
                //用户托管状态
                trusteeship_state:data[i].trusteeship_state,
                ////定位经纬度
                la:data[i].la,
                lo:data[i].lo
            });
            cc.vv.gameNetMgr.preHeadInfo.push({
                userid:data[i].userid,
                url:data[i].headImage
            });
            if(data[i].userid != null && data[i].userid != 0)
                cc.vv.gameNetMgr.allHead.push({ spr: cc.vv.gameNetMgr.guestHead, userid: data[i].userid, url: null });
        }

        cc.vv.global.seats = cc.vv.gameNetMgr.seats;

        cc.vv.gameNetMgr.beginHeadDownload();
    },

    // 得到座位信息
    getSeats : function()
    {
        if (cc.vv.gameNetMgr.seats)
            return cc.vv.gameNetMgr.seats;
        else if (cc.vv.global.seats)
            return cc.vv.global.seats;
        cc.error(" ---------------------seats座位是null-------------------------");
        return null;
    },
    //设置单个座位数据
    setOneSeat: function (seatIndex, data) {
        var seats = cc.vv.gameNetMgr.getSeats();
        var kkk = seats[seatIndex];
        kkk.userid = data.userid;
        kkk.score = data.score;
        kkk.name = data.name;
        kkk.online = data.online;
        kkk.ready = data.ready;
        kkk.seatindex = data.seatindex;
        kkk.ip = data.ip;
        kkk.headImage = data.headImage;
        kkk.sex = data.sex;
        kkk.coins = data.coins;
        //用户托管状态
        kkk.trusteeship_state = data.trusteeship_state;
        ///定位经纬度

        kkk.lo = data.lo;
        kkk.la = data.la;

        cc.vv.gameNetMgr.allHead.push({ spr: cc.vv.gameNetMgr.guestHead, userid: data.userid, url: null });
        cc.vv.gameNetMgr.preHeadInfo.push({
                userid:data.userid,
                url:data.headImage
            });
        cc.vv.gameNetMgr.beginHeadDownload();
    },

    getSeatSexPre:function(seatIndex){
        console.log("getSeatSexPre pre: this.seats["+seatIndex+"]:");
        var pre = "women";
        if(this.seats){
            console.log("getSeatSexPre pre: this.seats["+seatIndex+"]:" + this.seats[seatIndex].sex);
            if(this.seats[seatIndex]){
                if(this.seats[seatIndex].sex){
                    if(this.seats[seatIndex].sex == 1)
                    {pre = "man";}
                    if(this.seats[seatIndex].sex == 2)
                    {pre = "women";}
                    return pre;
                }
            }
        }
        return pre;
    },

    getIndexSeatCanAdd:function(userid){
        var kk = cc.vv.gameNetMgr.getSeats();
        for (var i = 0; i < kk.length; i++) {
            if(kk[i].userid == userid){//找到这个ID，说明有数据，返回位置
                return i;
            }
        }
        for (var i = 0; i < kk.length; i++) {
            if(kk[i].userid == null){//再次遍历，找到没有数据的位置，返回
                return i;
            }
        }
        return -1;
    },

    //获取已经存储头像的下标
    getHeadIndex: function (userid) {
        for (var i = 0; i < cc.vv.gameNetMgr.allHead.length; i++) {
            if (userid == cc.vv.gameNetMgr.allHead[i].userid) 
                return i;
        }
        return -1;
    },

    //循环检查头像是否下载
    beginHeadDownload:function(){
        if(cc.vv.gameNetMgr.isFinishDownloadHead){//如果检查到之前的下载全部完毕，进入循环,否则不管
            cc.vv.gameNetMgr.isFinishDownloadHead = false;//标志为false
            cc.vv.gameNetMgr.loopHeadDownload();
        }
    },

    loopHeadDownload:function(){
        var kk = cc.vv.gameNetMgr;
        //如果useHeadInfo中没有数据则拿走所有preHeadInfo的数据
        if(kk.useHeadInfo.length == 0){
            kk.getAllPreHeadInfo();//获取数据
            console.log("拿到准备的全部头像");
        }
        //如果还是没有数据，则完成这次循环
        if(kk.useHeadInfo.length == 0){
            kk.isFinishDownloadHead = true;//标志修改为true
            console.log("这次所有头像都下载完成了");
            return;
        }
            
        var last = kk.useHeadInfo.length - 1;
        var callback = function (sign) {
            if (sign == 1) {//有数据更新，更改指定用户的头像
                kk.dispatchEvent('new_head_spr', kk.getSeatByID(kk.useHeadInfo[last].userid));
            } else if (sign == 0) {//没有数据更新

            }
            //这个数据使用之后，从useHeadInfo移除这个数据
            console.log("useHeadInfo length: " + kk.useHeadInfo.length);
            kk.useHeadInfo.pop();
            console.log("删除后 useHeadInfo length: " + kk.useHeadInfo.length);
            cc.vv.gameNetMgr.loopHeadDownload();
        };
        //下载头像
        console.log("进入头像下载 userid ： " + kk.useHeadInfo[last].userid);
        kk.loadSprite(kk.useHeadInfo[last].url,kk.useHeadInfo[last].userid,callback)

    },

    //把preHeadInfo中数据全部转到useHeadInfo中，并置空preHeadInfo
    getAllPreHeadInfo:function(){
        var length = cc.vv.gameNetMgr.preHeadInfo.length;
        for(var i = 0; i < length; i++){
            cc.vv.gameNetMgr.useHeadInfo.push({
               userid:cc.vv.gameNetMgr.preHeadInfo[i].userid,
               url:cc.vv.gameNetMgr.preHeadInfo[i].url,
            });
        }
        cc.vv.gameNetMgr.preHeadInfo = [];
    },

    //添加头像精灵到数据中,这儿userid统一用小写
    loadSprite: function (url, userid,callback) {
        var sign = 0;//有数据更新则为1，否则为0
        console.log("loadSprite开始");
        if (userid != null) {//userid不为空才是玩家，进行操作
            console.log("loadSprite： 检查到userid不为空 ： " + userid);
            var index = cc.vv.gameNetMgr.getHeadIndex(userid);
            if (index == -1) {//如果没有则往后推入数据
                console.log("loadSprite： 检查到index为 -1 ，没有数据，需下载");

                if (url == null) {//url为空，直接推入空数据
                    console.log("loadSprite： 检查到url为:" + url +" ，推入空数据");
                    cc.vv.gameNetMgr.allHead.push({ spr: cc.vv.gameNetMgr.guestHead, userid: userid ,url: url});
                    sign = 1;
                    if(callback)
                        callback(sign);
                }else {//从url下载图片，成功后推入数据
                    console.log("loadSprite： 检查到url为:" + url +" ，下载推入数据");
                    cc.loader.load(url + ".png", function (err, tex) {
                        if (err) {
                            cc.vv.gameNetMgr.allHead.push({ spr: cc.vv.gameNetMgr.guestHead, userid: userid, url: null });
                            sign = 1;
                            if (callback)
                                callback(sign);
                            return;
                        }
                        //var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                        cc.vv.gameNetMgr.allHead.push({ spr: new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height)), userid: userid ,url:url});
                        console.log("下载成功，数据为：" + "userid: " + userid + " index：" + index + " url: " + url);
                        sign = 1;
                        if(callback)
                            callback(sign);
                    });
                }

            }else{//如果有这个玩家的数据，则比对后更改数据
                console.log("loadSprite： 检查到index为:" + index +"有数据，需比对");

                if(cc.vv.gameNetMgr.allHead[index].url == url){//如果新数据和老数据 一样，则不需下载
                    console.log("loadSprite： url一致 ，无需多余操作");
                    sign = 0;
                    if(callback)
                    callback(sign);

                }else{//新数据不一样，下载并更新数据
                    console.log("loadSprite： 检查到新的url为:" + url +" ，需下载推入新数据");
                    cc.loader.load(url + ".png", function (err, tex) {
                        //如果失败了，不更改数据
                        if (err) {
                            return;
                        }
                        //var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                        cc.vv.gameNetMgr.allHead[index].spr = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height)), 
                        cc.vv.gameNetMgr.allHead[index].userid = userid ,
                        cc.vv.gameNetMgr.allHead[index].url = url;
                        console.log("下载新数据成功，数据为：" + "userid: " + userid + " index：" + index + " url: " + url);
                        sign = 1;
                        if(callback)
                            callback(sign);
                    });
                }

            }
        }else{//userid为空不是玩家
            console.log("  loadSprite： 检查到userid为空 ： " + userid);
            sign = 0;
            if(callback)
                callback(sign);
        }
    },

    clear:function(){
        this.dataEventHandler = null;
        console.log("clear--------------this.isOver == " + this.isOver);
        if((this.isOver == null ) ||  (this.isOver == true)){
            this.dissoveData = null;
            this.seats = null;
            this.roomId = null;
            this.maxNumOfGames = 0;
            this.numOfGames = 0;        
        }
    },
    
    dispatchEvent(event,data){
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }    
    },
    
    getSeatIndexByID:function(userId){
        var seats = this.getSeats();
        for(var i = 0; i < seats.length; ++i){
            var s = seats[i];
            if(s.userid === userId){
                return i;
            }
        }
        return -1;
    },

    getSeatNameByID: function (userId) {
        var seats = this.getSeats();
        for (var i = 0; i < seats.length; ++i) {
            var s = seats[i];
            if (s.userid === userId) {
                return s.name;
            }
        }
        return "error";
    },
    
    isOwner:function(){
        return this.seatIndex == 0;   
    },
    
    getSeatByID:function(userId){
        if(this == cc.vv.gameNetMgr)
        {
            console.log("this == cc.vv.gameNetMgr");
        }
        else
        {
            console.log("this != cc.vv.gameNetMgr");
        }
        console.log("getSeatByID userId" + userId);
        var seatIndex = this.getSeatIndexByID(userId);
        console.log("getSeatByID getSeatByID" + seatIndex);
        console.log("getSeatByID this.seats" + JSON.stringify(this.seats));
        // var seat = this.seats[seatIndex];
        var seats = this.getSeats();
        var seat = seats[seatIndex];
        console.log("getSeatByID gameNetMgr getseatByid :seatIndex " + seatIndex);
        return seat;
    },
    
    getSelfData:function(){
        //console.log("initHuaipaiInfo:seat21  getSelfData " + JSON.stringify(this.seats));
        var seats = this.getSeats();
        return seats[this.seatIndex];
    },
    
    getLocalIndex:function(index){
        var ret = (index - this.seatIndex + 4) % 4;
        if(cc.vv.gameNetMgr.conf.renshu == 3){
            ret = (index - this.seatIndex + 3) % 3;
        }
        //if(cc.vv.Global.Debug)
        //console.log("getLocalIndex: index:" + index + " LocalIndex:" + ret);
        return ret;
    },
    
    prepareReplay:function(roomInfo,detailOfGame){
        var self = this;
        this.roomId = roomInfo.id;
        console.log("prepareReplay gamenetmgr.roomId"+self.roomId);
        this.seats = roomInfo.seats;
        var obj = JSON.parse(detailOfGame.baseInfo);
        this.turn = obj.button;
        var baseInfo = obj;
        for(var i = 0; i < this.seats.length; ++i){
            var s = this.seats[i];
            s.seatindex = i;
            s.score = null;
            s.holds = baseInfo.game_seats[i];
            s.pengs = [];
            s.angangs = [];
            s.diangangs = [];
            s.wangangs = [];
            //s.chis = [];
            s.folds = [];
            s.mammonCard = [];
            s.tingStatus = -1;
            console.log(s);
            if(cc.vv.userMgr.userId == s.userid){
                this.seatIndex = i;
            }
            cc.vv.gameNetMgr.preHeadInfo.push({
                userid:s.userid,
                url:s.headImage
            });
        }

        cc.vv.global.seats = roomInfo.seats;
        cc.vv.gameNetMgr.beginHeadDownload();
        this.conf = {
            type:baseInfo.type,
        }
        if(this.conf.type == null){
            this.conf.type == "xzdd";
            if(cc.vv.global.selectGameTypeId == 10001){
                this.conf.type = "eeds";
            }
            if(cc.vv.global.selectGameTypeId == 10000){
                this.conf.type = "xzdd";
            }
            if(cc.vv.global.selectGameTypeId == 10002){
                this.conf.type = "dzmj";
            }
        }
        else
        {
            this.conf.renshu = this.seats.length;
        }
    },
    getwanfaArr:function()
    {
        var rulearr=[];
        var conf = this.conf;
        //console.log("getWanfa selectGameTypeId" + cc.vv.global.selectGameTypeId + " " + JSON.stringify(this.conf));
        //if(conf && conf.maxGames!=null && conf.maxFan!=null){
        console.log("gameNetMgr getwanfa conf: " + JSON.stringify(conf));
        console.log("gameNetMgr getwanfa roomgameNum: " + conf.roomGameNum);
        //如果是金币场，固定的输出
        if(cc.vv.gameNetMgr.conf.type == cc.vv.global.GameType.GoldsMJ) {
            return rulearr;
        }
        if(conf && conf.roomGameNum!=null)
        {
            var strArr = [];
            if(cc.vv.global.selectGameTypeId == 10002 && conf.zuidafanshu!=null)
            {
                if(conf.hsz){
                    rulearr.push("换三张");   
                }
                if(conf.zimo == 1)
                {
                    rulearr.push("自摸加番");
                }
                else
                {
                    rulearr.push("自摸加底");
                }
                if(conf.jiangdui){
                    rulearr.push("幺九将对");   
                }
                if(conf.menqing){
                    rulearr.push("门清中张");   
                }
                if(conf.hujiaozhuanyi){
                    rulearr.push("呼叫转移");   
                }
                if(conf.badaotang){
                    rulearr.push("巴倒烫");   
                }
                if (conf.koufangka) {
                    strArr.push("AA扣");
                }
                else {
                    strArr.push("房主扣");
                }
            }

            return rulearr;
        }
        return rulearr;
    },
    getWanfa:function(){
        var conf = this.conf;
        //console.log("getWanfa selectGameTypeId" + cc.vv.global.selectGameTypeId + " " + JSON.stringify(this.conf));
        //if(conf && conf.maxGames!=null && conf.maxFan!=null){
        console.log("gameNetMgr getwanfa conf: " + JSON.stringify(conf));
        console.log("gameNetMgr getwanfa roomgameNum: " + conf.roomGameNum);
        //如果是金币场，固定的输出
        if(cc.vv.gameNetMgr.conf.type == cc.vv.global.GameType.GoldsMJ) {
            return "血战到底 呼叫转移 巴倒烫 底分120分";
        }
        if(conf && conf.roomGameNum!=null){
            var strArr = [];
            if(cc.vv.global.selectGameTypeId == 10000 && conf.zuidafanshu!=null){
                //strArr.push(conf.maxGames + "局");
                strArr.push(conf.roomGameNum + "局");
                //strArr.push(conf.maxFan + "番封顶");

                strArr.push(conf.zuidafanshu + "番封顶");

                if(conf.hsz){
                    strArr.push("换三张");   
                }
                if(conf.zimo == 1){
                    strArr.push("自摸加番");
                }
                else{
                    strArr.push("自摸加底");
                }
                if(conf.jiangdui){
                    strArr.push("将对");   
                }
                if(conf.dianganghua == 1){
                    strArr.push("点杠花(自摸)");   
                }
                else{
                    strArr.push("点杠花(放炮)");
                }
                if(conf.menqing){
                    strArr.push("门清、中张");   
                }
                if(conf.tiandihu){
                    strArr.push("天地胡");   
                }
            }
            if(cc.vv.global.selectGameTypeId == 10001 ){
                console.log("10001" + JSON.stringify(this.conf));
                strArr.push(conf.jushuxuanze + "局");
                if(conf.renshu){
                    strArr.push(""+ conf.renshu + "人");   
                }
                if(conf.sanRenQueYiMen){
                    strArr.push("缺一门");   
                }

                if(!conf.afterChiTing && conf.afterPengTing && !conf.chi && conf.peng){
                    strArr.push("不许吃牌，碰牌上听");   
                }
                if(conf.afterChiTing && conf.afterPengTing && conf.chi && conf.peng){
                    strArr.push("一口香");   
                }
                if(!conf.afterChiTing && !conf.afterPengTing && !conf.chi && conf.peng){
                    strArr.push("不许吃牌，允许碰牌");   
                }
                if(!conf.afterChiTing && !conf.afterPengTing && conf.chi && conf.peng){
                    strArr.push("允许吃牌，允许碰牌");   
                }
                if(conf.afterChiTing && !conf.afterPengTing && conf.chi && conf.peng){
                    strArr.push("吃牌上听，允许碰牌");   
                }
                if(!conf.afterChiTing && !conf.afterPengTing && !conf.chi && !conf.peng){
                    strArr.push("不许吃牌，不许碰牌");   
                }


                if(conf.dunLaPao > 0){
                    strArr.push("蹲拉跑"+ conf.dunLaPao + "分");   
                }
                if(conf.duoXiang){
                    strArr.push("一炮多响");   
                }
                if (conf.noWind) {
                    strArr.push("不带风");
                }

                if (conf.koufangka) {
                    strArr.push("AA扣");
                }
                else {
                    strArr.push("房主扣");
                }

            }

            if(cc.vv.global.selectGameTypeId == 10002 && conf.zuidafanshu!=null){
                //strArr.push(conf.maxGames + "局");
                strArr.push( conf.renshu + "人" + conf.roomGameNum + "局 ");

                //strArr.push(conf.maxFan + "番封顶");
                strArr.push("玩法:")
                strArr.push(conf.zuidafanshu + "番封顶");
                if(conf.huansanzhang){
                    strArr.push("换三张");   
                }
                if(conf.zimo == 1){
                    strArr.push("自摸加番");
                }
                else{
                    strArr.push("自摸加底");
                }
                if(conf.jiangdui){
                    strArr.push("幺九将对");   
                }
                // if(conf.dianganghua == 1){
                //     strArr.push("点杠花(自摸)");   
                // }
                // else{
                //     strArr.push("点杠花(放炮)");
                // }
                if(conf.menqing){
                    strArr.push("门清中张");   
                }
                // if(conf.tiandihu){
                //     strArr.push("天地胡");   
                // }
                if(conf.hujiaozhuanyi){
                    strArr.push("呼叫转移");   
                }
                if(conf.badaotang){
                    strArr.push("巴倒烫");   
                }

                
                if (conf.koufangka) {
                    strArr.push("AA扣");
                }
                else {
                    strArr.push("房主扣");
                }
            }

            return strArr.join(" ");
        }
        return "";
    },
    
    //注册服务器监听---一大波
    initHandlers:function(){
        var self = this;
        //借用这儿做点其他事情
        this.getGuestHead();

        cc.vv.allRequest.addHandler("login_result",function(data){
            console.log("lqy login_result test "+ JSON.stringify(data));
            if(data.errcode === 0){
                var data = data.data;
                self.roomId = data.roomid;
                self.conf = data.conf;//房间规则
                console.log("login_result gamenetmgr.roomId"+self.roomId);
                self.conf = data.conf;
                self.maxNumOfGames = data.conf.maxGames;
                self.numOfGames = data.numofgames;
                self.seats = data.seats;
                console.log("lqy login_result test "+ JSON.stringify(data.seats));
                self.seatIndex = self.getSeatIndexByID(cc.vv.userMgr.userId);
                //self.seatIndex = self.getSeatIndexByID(1000);
                self.isOver = false;
                
                
                for(var i = 0; i <  4; ++i){
                    //自摸胡的牌显示
                    if(self.seatsIsZimo[i] == null){
                        self.seatsIsZimo[i] = false;
                    }
                    //重连胡的牌显示
                    self.seats[i].huedPai = -1;
                }

            }
            else{
                console.log(data.errmsg);   
            }
        });
                
        cc.vv.allRequest.addHandler("login_finished",function(data){
            console.log("login_finished");

            //预加载场景，然后进入
            cc.vv.wc.show("");
            cc.vv.global.loadScene("mjgame");
        });

        cc.vv.allRequest.addHandler("exit_result",function(data){
            self.roomId = null;
            self.turn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.seats = null;
        });
        
        //以前----用户退出
        cc.vv.allRequest.addHandler("exit_notify_push",function(data){
           var userId = data;
           var s = self.getSeatByID(userId);
           if(s != null){
               s.userid = 0;
               s.name = "";
               self.dispatchEvent("user_state_changed",s);
           }
        });
        
        cc.vv.allRequest.addHandler("dispress_push",function(data){
            self.roomId = null;
            self.turn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.seats = null;
        });
                
        cc.vv.allRequest.addHandler("disconnect",function(data){
            //连接gate服务器断开连接
            var bIsConnector = false;
            if(window.pomeloIp1 == window.pomeloIp && window.pomeloPort1 == window.pomeloPort) {
                bIsConnector = false;
                return;
            }
            //连接connector服务器断开连接
            else
            {
                bIsConnector = true;
            }
            console.log("@@@@@@@@@-------------GameNetMgr.js addHandler(disconnect"+window.pomeloIp + ":" +window.pomeloPort +"!=" + window.pomeloIp1 + ":" +window.pomeloPort1);
            console.log("@@@@@@@@@-------------bIsConnector: " + bIsConnector);
            //self.roomId = 999999;

            if(self.roomId == null && bIsConnector == true){
                //cc.director.loadScene("hall");
                //console.log("GameNetMgr.js addHandler(disconnect  loadScene(hall");
            }
            else{
                if(self.isOver == false){
                    cc.vv.userMgr.oldRoomId = self.roomId;
                    self.dispatchEvent("disconnect");                    
                }
                else{
                    self.roomId = null;
                }
            }
        });
        
        //以前----用户进入
        cc.vv.allRequest.addHandler("new_user_comes_push",function(data){
            console.log("lqy new_user_comes_push test "+ JSON.stringify(data));
            var seatIndex = data.seatindex;
            if(self.seats[seatIndex].userid > 0){
                self.seats[seatIndex].online = true;
            }
            else{

                //console.log("lqy new_user_comes_push test "+seatIndex);
                data.online = true;
                self.seats[seatIndex] = data;
            }
            //console.log("lqy new_user_comes_push test1 ");
            self.dispatchEvent('new_user',self.seats[seatIndex]);
            //console.log("lqy new_user_comes_push test2 ");
        });

        //现在----用户进入
        cc.vv.PomeloNetMgr.ListingOn("onUserEnter",function(data){
            console.log(" 我收到广播了 onUserEnter " + JSON.stringify(data) + " seatIndex:" + data.seats.seatindex);
            //var seatIndex = self.getIndexSeatCanAdd(data.seats.userid);
            var seatIndex = data.seats.seatindex;
            if(seatIndex == -1){
                console.log("我马上要炸了");
                cc.vv.alert.show("提示","我炸到用户进入了");
            }
            // for(var i = 0; i < cc.vv.gameNetMgr.seats.length; i++){
            //     console.log("cc.vv.gameNetMgr.seats" + i +" : " + JSON.stringify(cc.vv.gameNetMgr.seats[i]));
            // }

            //data.seats.online = true;

            self.setOneSeat(seatIndex, data.seats);
            // for(var i = 0; i < cc.vv.gameNetMgr.seats.length; i++){
            //     console.log("cc.vv.gameNetMgr.seats" + i +" : " + JSON.stringify(cc.vv.gameNetMgr.seats[i]));
            // }
            self.dispatchEvent('new_user',self.seats[seatIndex]);
        });

        //现在----用户退出
        cc.vv.PomeloNetMgr.ListingOn("onUserLeave",function(data){
            console.log(" 我收到广播了  onUserLeave " + JSON.stringify(data));                         
           var userId = data.userId;

           //置空离开的玩家头像
           var index = cc.vv.gameNetMgr.getHeadIndex(userId);  
           if(index != -1){
               cc.vv.gameNetMgr.allHead.splice(index,1);;
           }

           var s = self.getSeatByID(userId);
           if(s != null){
               s.userid = 0;
               s.name = "";
               s.lo = 0;
               s.la = 0;

               self.dispatchEvent("user_state_changed",s);
           }
        });

        //现在----用户上线和离线
        cc.vv.PomeloNetMgr.ListingOn("onUserOffline", function (data) {
            console.log(" 我收到广播了  onUserOffline " + JSON.stringify(data));
            var userId = data.userId;
            var seat = self.getSeatByID(userId);
            seat.online = data.online;
            self.dispatchEvent('user_state_changed', seat);
            //如果自己离线了，去查问一下是不是真的离线了
            if (userId == cc.vv.userMgr.userId) {
                console.log("gamenetmgr 我去问下我是不是掉线了");

                var failFun = function () {
                    cc.vv.allRequest.linkToGate();
                };

                var successFun = function (ret) {
                    cc.vv.wc.hide();
                    var seatkk = cc.vv.gameNetMgr.getSelfData();
                    seatkk.online = true;
                    cc.vv.gameNetMgr.dispatchEvent('user_state_changed', seatkk);
                };

                cc.vv.wc.show("");
                cc.vv.allRequest.thirdRequest("connector.entryHandler.checkIsOnline", null, successFun, failFun, 5000);
            }
        });

        //现在----房主解散
        cc.vv.PomeloNetMgr.ListingOn("onHouseownerDissolve",function(data){
            console.log(" 我收到广播了  onHouseownerDissolve " + JSON.stringify(data));
           var userId = data.from;
           //如果房主是自己跳过广播
           if(cc.vv.userMgr.userId == userId)
                return;
            cc.vv.alert.show("解散房间", "房主已解散房间！", function () {
                console.log("房主解散了，我不是房主，我晓得了");
                //清除数据
                cc.vv.gameNetMgr.cleanGameNetMgrData();

                //预加载场景，然后进入
                cc.vv.wc.show("");
                cc.vv.global.loadScene("hall");
            });
        });
        
        //以前----用户上线和离线
        cc.vv.allRequest.addHandler("user_state_push",function(data){
            console.log("user_state_push :" + JSON.stringify(data));
            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            seat.online = data.online;
            self.dispatchEvent('user_state_changed',seat);
        });
        
        cc.vv.allRequest.addHandler("user_ready_push",function(data){
            console.log("user_ready_push :" + JSON.stringify(data));
            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            seat.ready = data.ready;
            self.dispatchEvent('user_state_changed',seat);
        });

        //用户托管状态推送
        cc.vv.allRequest.addHandler("user_trusteeship_push",function(data){
            console.log("user_trusteeship_push :" + JSON.stringify(data));
            var userId = data.userId;
            var seat = self.getSeatByID(userId);
            seat.trusteeship_state = data.trusteeship_state;
            self.dispatchEvent('user_state_changed',seat);
            if(userId == cc.vv.userMgr.userId){
                self.dispatchEvent("user_trusteeship_state_change");
            }
        });
        
        cc.vv.allRequest.addHandler("game_holds_push",function(data){
            console.log("game_holds_push");
            console.log(data);
            console.log("gamenetmgr gameholdpush seatIndex : " + self.seatIndex);
            var seat = self.seats[self.seatIndex]; 

            seat.holds = data;
            
            for(var i = 0; i < self.seats.length; ++i){
                var s = self.seats[i]; 
                if(s.folds == null){
                    s.folds = [];
                }
                if(s.pengs == null || s.pengs == undefined){
                    s.pengs = [];
                }
                if(s.angangs == null){
                    s.angangs = [];
                }
                if(s.diangangs == null){
                    s.diangangs = [];
                }
                if(s.wangangs == null){
                    s.wangangs = [];
                }
                // if(s.chis == null){
                //     s.chis = [];
                // }
                s.ready = false;
            }
            self.dispatchEvent('game_holds');
        });

         cc.vv.allRequest.addHandler("onchat",function(data){
            console.log("onchat");
            console.log("onchat"+ JSON.stringify(data));
        });
         
        cc.vv.allRequest.addHandler("game_begin_push",function(data){
            console.log('game_begin_push' + JSON.stringify(data));
            self.button = data;
            self.turn = self.button;
            self.gamestate = "begin";
            for(var i = 0; i < self.seats.length; i++){
                self.seats[i].tingStatus = -1;
            }
            self.dispatchEvent('game_begin');
            cc.vv.GlobalMsg.Send("GameMgrMSG",cc.vv.GLGameDefine.MessageType.game_autofightstate);
        });
        
        cc.vv.allRequest.addHandler("game_playing_push",function(data){
            console.log('game_playing_push'); 
            self.gamestate = "playing"; 
            self.dispatchEvent('game_playing');
        });
        
        cc.vv.allRequest.addHandler("game_sync_push",function(data){
            console.log("game_sync_push");
            console.log(data);
            self.numOfMJ = data.numofmj;
            self.gamestate = data.state;
            if(self.gamestate == "dingque"){
                self.isDingQueing = true;
            }
            else if(self.gamestate == "huanpai"){
                self.isHuanSanZhang = true;
            }
            self.turn = data.turn;
            self.button = data.button;
            self.chupai = data.chuPai;
            self.huanpaimethod = data.huanpaimethod;
            for(var i = 0; i < 4; ++i){
                var seat = self.seats[i];
                var sd = data.seats[i];
                seat.holds = sd.holds;
                seat.folds = sd.folds;
                seat.angangs = sd.angangs;
                seat.diangangs = sd.diangangs;
                seat.wangangs = sd.wangangs;
                seat.pengs = sd.pengs;
                seat.dingque = sd.que;
                seat.hued = sd.hued; 
                seat.iszimo = sd.iszimo;
                seat.huinfo = sd.huinfo;
                seat.huanpais = sd.huanpais;
                if(i == self.seatIndex){
                    self.dingque = sd.que;
                }
           }
        });
        
        cc.vv.allRequest.addHandler("game_dingque_push",function(data){
            self.isDingQueing = true;
            self.isHuanSanZhang = false;
            self.dispatchEvent('game_dingque');
        });
        
        cc.vv.allRequest.addHandler("game_huanpai_push",function(data){
            self.isHuanSanZhang = true;
            self.dispatchEvent('game_huanpai');
        });
        
        cc.vv.allRequest.addHandler("hangang_notify_push",function(data){
            self.dispatchEvent('hangang_notify',data);
        });
        
        cc.vv.allRequest.addHandler("game_action_push",function(data){
            self.curaction = data;
            console.log("game_action_push: " + JSON.stringify(data));
            console.log(data);
            self.dispatchEvent('game_action',data);
        });
        
        cc.vv.allRequest.addHandler("game_chupai_push",function(data){
            console.log('game_chupai_push------');
            console.log(data);
            console.log(JSON.stringify(data));
            console.log('game_chupai_push------');
            var turnUserID = data/*.turnSeatUserId*/;
            var si = self.getSeatIndexByID(turnUserID);
            self.doTurnChange(si/*, data.lastTurnHuStatus*/);
        });
        
        cc.vv.allRequest.addHandler("game_num_push",function(data){
           
            self.numOfGames = data;
            console.log('game_num_push:' + data + "  self.numOfGames:"+ self.numOfGames);
            self.dispatchEvent('game_num',data);
        });

        cc.vv.allRequest.addHandler("game_over_push",function(data){
            console.log('game_over_push, data: ' + JSON.stringify(data));
            var results = data.results;

            var time = data.roomUuid / 1000000;
            time = Math.round(time);
            self.createTime = self.dateFormat(time);

            for(var i = 0; i <  self.seats.length; ++i){
                self.seats[i].score = results.length == 0? 0:results[i].totalscore;
                self.seats[i].holds = results.length == 0? new Array():results[i].holds.concat();
            }

            self.dispatchEvent('tanpai',results);
            setTimeout(function(){
                self.dispatchEvent('game_over',results);
                if(data.endinfo){
                    self.isOver = true;
                    for(var i = 0; i <  self.seats.length; ++i){
                        self.seats[i].score = data.endinfo[i].totalscore;
                    }
                    console.log('game_over_push----------isOver------------- ');
                    self.dispatchEvent('game_end',data.endinfo);    
                }

                self.reset();
                self.dispatchEvent('game_over_tuoguan');
                for(var i = 0; i <  self.seats.length; ++i){
                    self.dispatchEvent('user_state_changed',self.seats[i]);    
                }
            },4500);



            
            
            
                


        });
        
        cc.vv.allRequest.addHandler("mj_count_push",function(data){
            console.log('mj_count_push');
            self.numOfMJ = data;
            //console.log(data);
            self.dispatchEvent('mj_count',data);
           
        });
        
        cc.vv.allRequest.addHandler("hu_push",function(data){
            console.log('hu_push');
            console.log(data);
            for(var i = 0; i <  self.seats.length; ++i){
                if(self.seatsIsZimo[i] == null){
                    self.seatsIsZimo[i] = false;
                }
            }
            
            self.doHu(data);
        });
        
        cc.vv.allRequest.addHandler("game_chupai_notify_push",function(data){
            self.chupaiCount ++;
            if(self.chupaiCount>1){
                cc.error("game_chupai_notify_push recevied!");
                return;
            }
            console.log("game_chupai_notify_push");
            var userId = data.userId;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            // if(!self.avoidBugRevMulti(data.pai,"outcard",si)){
            //      console.log('game_chupai_notify_push unnormal');
            //     return;
            // }
            // else{
            //     cc.vv.net.send("game.playerHandler.refreshHolds");
            // }

            self.doChupai(si,pai);
        });
        
        cc.vv.allRequest.addHandler("game_mopai_push",function(data){
            console.log('game_mopai_push------');
            console.log(data);
            console.log(JSON.stringify(data));
            console.log('game_mopai_push------');
            self.leftCardsNum = data.perCardLeftNum.concat();
            self.doMopai(self.seatIndex,data.pai);
        });
        cc.vv.allRequest.addHandler("specially_tidy_holds_push",function(data){
            console.log('specially_tidy_holds_push'+data);
            cc.vv.GlobalMsg.Send("playDeskAction",data);
        });
        
        cc.vv.allRequest.addHandler("guo_notify_push",function(data){
            console.log('guo_notify_push');
            var userId = data.userId;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doGuo(si,pai);
        });
        
        cc.vv.allRequest.addHandler("guo_result",function(data){
            console.log('guo_result');
            self.dispatchEvent('guo_result');
        });
        
        cc.vv.allRequest.addHandler("guohu_push",function(data){
            console.log('guohu_push');
            self.dispatchEvent("push_notice",{info:"过胡",time:1.5});
        });
        
        cc.vv.allRequest.addHandler("huanpai_notify",function(data){
            console.log("huanpai_notify :" + JSON.stringify(data));
            var seat = self.getSeatByID(data.si);
            seat.huanpais = data.huanpais;
            self.dispatchEvent('huanpai_notify',seat);
        });
        
        cc.vv.allRequest.addHandler("game_huanpai_over_push",function(data){
            console.log('game_huanpai_over_push');
            var info = "";
            var method = data.method;
            if(method == 0){
                info = "换对家牌";
            }
            else if(method == 1){
                info = "换下家牌";
            }
            else{
                info = "换上家牌";
            }
            self.huanpaimethod = method;
            cc.vv.gameNetMgr.isHuanSanZhang = false;
            self.dispatchEvent("game_huanpai_over");
            self.dispatchEvent("push_notice",{info:info,time:2});
        });
        
        cc.vv.allRequest.addHandler("peng_notify_push",function(data){
            self.pengCount ++;
            if(self.pengCount>1){
                cc.error("peng_notify_push recevied!");
                return;
            }
            console.log('peng_notify_push');
            console.log('peng_notify_push:'+data);
            console.log('peng_notify_push:'+JSON.stringify(data));
            console.log(data);
            // if(!self.avoidBugRevMulti(data.pai,"peng")){
            //      console.log('peng_notify_push unnormal');
            //     return;
            // }
            // // else{
            // //     cc.vv.net.send("game.playerHandler.refreshHolds");
            // // }
            var userId = data.userid;
            var pai = data.pai;
            self.leftCardsNum = data.perCardLeftNum.concat();
            var si = self.getSeatIndexByID(userId);
            self.doPeng(si,data.pai);
        });
        
        cc.vv.allRequest.addHandler("gang_notify_push",function(data){
            self.gangCount ++;
            if(self.gangCount>1){
                cc.error("gang_notify_push recevied!");
                return;
            }
            console.log('gang_notify_push');
            console.log(data);
            // if(!self.avoidBugRevMulti(data.pai,"gang")){
            //      console.log('gang_notify_push unnormal');
            //     return;
            // }
            // // else{
            // //     cc.vv.net.send("game.playerHandler.refreshHolds");
            // // }
            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.doGang(si,pai,data.gangtype);
        });
        
        cc.vv.allRequest.addHandler("game_dingque_notify_push",function(data){
            self.dispatchEvent('game_dingque_notify',data);
        });
        
        cc.vv.allRequest.addHandler("game_dingque_finish_push",function(data){
            console.log('game_dingque_finish_push:'+JSON.stringify(data));
            for(var i = 0; i < data.length; ++i){
                self.seats[i].dingque = data[i];
                if(i == self.seatIndex){
                    self.dingque = self.seats[i].dingque;
                }
            }
            
            //定缺完成后重置查叫剩余牌数
            var selfHolds = self.getSelfData().holds;
            for(var i = 0; i < 27; ++i){
                self.leftCardsNum[i] = 4;
            }
            for(var i = 0; i < selfHolds.length; ++i){
                self.leftCardsNum[selfHolds[i]]--;
            }

            self.dispatchEvent('game_dingque_finish', data);
        });
        // 语音、短语、自定义文本、表情都在此处监听
        cc.vv.allRequest.addHandler("voice_msg_push", function (data) {
            // var data = data.detail;
            // var datatype = data.msg.type;
            cc.log("收到语音消息");
            // 聊天存档
            var chatlogData = {
                time:Date.now() / 1000,
                userId:data.from,
                msg:data.msg
            };
            self._chatLog.push(chatlogData);
            var datatype = JSON.parse(data.msg);
            switch (datatype.type) {
                case "talk":  self.dispatchEvent("voice_msg", data);  break;
                case "quick": self.dispatchEvent("quick_chat_push", data); break;
                case "emoji": self.dispatchEvent("emoji_push", data); break;
                case "chat": self.dispatchEvent("chat_push", data); break;
            }
        });
        // 自定义文本聊天
        cc.vv.allRequest.addHandler("voice_msg_pushs", function (data) {
            cc.log("收到文字消息");
            // 聊天存档
            var chatlogData = {
                time:Date.now() / 1000,
                userId:data.from,
                msg:data.msg
            };
            self._chatLog.push(chatlogData);
            self.dispatchEvent("chat_push", data);
        });
        // 短语
        cc.vv.allRequest.addHandler("quick_chat_push",function(data){
            self.dispatchEvent("quick_chat_push",data);
        });
        // 表情
        cc.vv.allRequest.addHandler("emoji_push",function(data){
            self.dispatchEvent("emoji_push",data);
        });
        
        cc.vv.allRequest.addHandler("dissolve_notice_push",function(data){
            console.log("dissolve_notice_push"); 
            console.log(data);
            self.dissoveData = data;
            self.dispatchEvent("dissolve_notice",data);
        });
        
        cc.vv.allRequest.addHandler("dissolve_cancel_push",function(data){
            self.dissoveData = null;
            self.dispatchEvent("dissolve_cancel",data);
        });
        
        cc.vv.allRequest.addHandler("dissolve_success_push",function(data){
            console.log("dissolve_success_push data : " + JSON.stringify(data));
            var id = data + "";
            self.dispatchEvent("dissolve_success",id);
        });


        cc.vv.allRequest.addHandler("specially_game_start_push",function(data){
            console.log("specially_game_start_push data : " + JSON.stringify(data)); 
            var id = data + "";
            self.dispatchEvent("specially_game_start",id);
        });
        //物品发放
        cc.vv.allRequest.addHandler("onPurchasedItem",function(data){
            cc.vv.global.Debuglog("onPurchasedItem:"+JSON.stringify(data)); 
            //{goodsId:purchaseItem.itemId,goodsNum:curNumber,orderId:ourOrderId}

            var goodsitem = require("goodsitem");
            var item = new goodsitem();
            item.goodsID = data.goodsId;
            item.goodsDes = "";
            item.goodsNum = data.goodsNum;
            item.goodsType = data.goodsId;
            cc.vv.propertyMgr.addgoodsItem(item);
            //self.dispatchEvent("goodsnotify");
            //cc.vv.userMgr.coins;  金币添加
            //cc.vv.userMgr.gems;   房卡添加
            //物品添加，通知刷新界面
            //cc.vv.GlobalMsg.Send("buySucess");
        });


        //-------------------------内蒙麻将事件处理 begin-------------------------------
        if(cc.vv.global.selectGameTypeId == 10001){

            //游戏开始时选择 蹲拉跑 ：	game_dun_la_pao_push              消息内容：  ''+game.bankerUser（庄家座位下标）   单发
            cc.vv.allRequest.addHandler("game_dun_la_pao_push", function (data) {
                console.log("game_dun_la_pao_push :" + JSON.stringify(data)); 

                cc.vv.gameNetMgr.gamestate = "DLP";
                cc.vv.GlobalMsg.Send("game_dun_la_pao_push",data);
            });

            //某玩家对蹲拉跑 做出了选择	game_dunLaPao_notify_push						seatData.userId  （玩家Id）		   群发
            cc.vv.allRequest.addHandler("game_dunLaPao_notify_push",function(data){
                console.log("game_dunLaPao_notify_push :" + JSON.stringify(data)); 

                cc.vv.GlobalMsg.Send("game_dunLaPao_notify_push",data);
            });

            //所有玩家 蹲拉跑 选择完了	game_DLP_finish_push 						arr[]		(所有人选择状态)		   群发
            cc.vv.allRequest.addHandler("game_DLP_finish_push",function(data){
                console.log("game_DLP_finish_push :" + JSON.stringify(data)); 
                for(var i = 0; i < data.length; ++i){
                    self.seats[i].dunOrLa = data[i].dunOrLa;
                    self.seats[i].pao = data[i].pao;
                }

                cc.vv.GlobalMsg.Send("game_DLP_finish_push_local",data);
            });
            //游戏开始时各玩家的财神牌：  game_start_mammonCard_push 		 消息内容：	{userId：，mammonCard：}		   群发//mammonCard 是数组
            cc.vv.allRequest.addHandler("game_start_mammonCard_push",function(data){
                console.log("game_start_mammonCard_push" + JSON.stringify(data));
                for(var i = 0; i < self.seats.length; i++) {
                    self.seats[i].mammonCard = data["" + i].concat();
                    console.log("self.seats[+"+ i +"]:" + self.seats[i]);
                }
            });

            //有人摸到财神牌          	mammonCard_push 								{pai:,userId: }					   群发
            cc.vv.allRequest.addHandler("mammonCard_push",function(data){
                console.log("mammonCard_push" + JSON.stringify(data));
                self.doMammonCard(data);
            });


            //有人吃						chi_notify_push									{userid:seatData.userId,		   群发													
            cc.vv.allRequest.addHandler("chi_notify_push",function(data){
                self.chiCount ++;
                if(self.chiCount>1){
                    cc.error("chi_notify_push recevied!");
                    return;
                }
                console.log("chi_notify_push");
                // pai:pai,						  //（与peng_notify_push消息发的位置一致）
                // chiKind:chiKind,                  //0:左 1:中 2:右
                // perCardLeftNum:leftCard}
                console.log(JSON.stringify(data));
                // if(!self.avoidBugRevMulti(data.pai,"chi")){
                //     console.log('chi_notify_push unnormal');
                //     return;
                // }
                // else{
                //     cc.vv.net.send("game.playerHandler.refreshHolds");
                // }
                var userId = data.userid;
                var pai = data.pai;
                self.leftCardsNum = data.perCardLeftNum.concat();
                var si = self.getSeatIndexByID(userId);
                self.doChi(si,data.pai,data.chiKind);

            });

            //有人听						game_ting_push									userId（听用户的Id）			   群发
            cc.vv.allRequest.addHandler("game_ting_push",function(data){
                
                self.getSeatByID(data).tingStatus = 3;
                self.dispatchEvent("game_ting",data);
            });
        }
        //-------------------------内蒙麻将事件处理 end-------------------------------

        cc.vv.allRequest.addHandler("game_start_perCardLeftNum_push",function(data){
            self.leftCardsNum = data.concat();
        });

        cc.vv.allRequest.addHandler("Start_Time_Push",function(data){
            console.log('Start_Time_Push' + JSON.stringify(data));
            self.dispatchEvent("Start_Time",data.msg);
        });
    },
    
    doGuo:function(seatIndex,pai){
        var seats = this.getSeats();
        var seatData = seats[seatIndex];
        if(seatData == null || seatData == undefined)
        {
            return;
        }
        var folds = seatData.folds;
        //folds.push(pai);



        this.dispatchEvent('guo_notify',seatData);


    },
    
    doMopai:function(seatIndex,pai){
        var seats = this.getSeats();
        var seatData = seats[seatIndex];
        if(seatData.holds){
            seatData.holds.push(pai);
            this.dispatchEvent('game_mopai',{seatIndex:seatIndex,pai:pai});            
        }
    },
    
    doChupai:function(seatIndex,pai){
        console.log("game_chupai_notify1 : seatIndex:"+seatIndex+" pai：" + pai);
        this.chupai = pai;
        var seats = this.getSeats();
        var seatData = seats[seatIndex];
        if(seatData.holds)
        {
            console.log("game_chupai_notify2 :seatData.holds :" + seatData.holds);             
            //var idx = seatData.holds.indexOf(pai);
                        // Simulator: game_chupai_notify1 ： pai：21
                        // Simulator: game_chupai_notify2 :seatData.holds :7,8,9,9,11,11,13,15,15,16,17,19,21,16
                        // Simulator: game_chupai_notify3 :seatData.holds :7,8,9,9,11,11,13,15,15,16,17,19,21 idx:-1
            var idx = -1;
            for(var i = 0; i < seatData.holds.length; i++) {
                if( pai == seatData.holds[i]){
                    idx = i;
                    break;
                }
            }
            seatData.holds.splice(idx,1);
            console.log("game_chupai_notify3 :seatData.holds :" + seatData.holds + " idx:" + idx +  "folds.push:"+pai);
        }
 
        seatData.folds.push(pai);
        
        this.dispatchEvent('game_chupai_notify',{seatData:seatData,pai:pai});
        console.log("game_chupai_notify4"); 
        this.dispatchEvent('game_refresh_fold',seatData);   
        
    },
    
    doPeng:function(seatIndex,pai){
        var seats = this.getSeats();
        var seatData = seats[seatIndex];
        // var backup = null;
        // if(seatData.holds){
        //     backup = seatData.holds.concat();
        // }
        //移除手牌
        // var removecount = 0;
        if(seatData.holds)
        {
            for(var i = 0; i < 2; i++)
            {
                //var idx = seatData.holds.indexOf(pai);
                var idx = -1;
                for(var n = 0; n < seatData.holds.length; n++) 
                {
                    if( pai == seatData.holds[n])
                    {
                        idx = n;
                        break;
                    }
                }
                console.log("doPeng :seatData.holds :" + seatData.holds + " idx:" + idx);
                if(idx != -1)
                {
                    seatData.holds.splice(idx,1);
                    // removecount++;
                }
                
            }
            // //自己移除手牌两张
            // if(removecount != 2) {
            //     if(backup){seatData.holds = backup.concat();}
            //     cc.error("GameNetMgr doPeng holds splice removecount failed" + seatData.holds);
            //     return;
            // }             
        }



        //更新碰牌数据
        var pengs = seatData.pengs;

        // //check pengs数据中是否有重复的牌，
        // for(var j = 0;j< pengs.length;j++)
        // {
        //     if(pengs[j] == pai)
        //     {
        //         cc.error("GameNetMgr doPeng repeat !!!");
        //         return;
        //     }
        // }
        pengs.push(pai);

        this.dispatchEvent('peng_notify',seatData);
        this.pickCardAfterOptFromFolds();

    },
    
    doChi:function(seatIndex,pai,kind){
        var seats = this.getSeats();
        var seatData = seats[seatIndex];
        //移除手牌
        //console.log("doChi :seatIndex :"+ seatIndex+" pai" + pai + " kind:" + kind);
        //console.log("doChi :seatData:"+ (seatData==null)+".holds :" + seatData.holds + " idx:" + idx);
        var removeArr = new Array(pai - kind, pai - kind + 1, pai - kind + 2);
        if(seatData.holds){
            for(var i = 0; i < 3; i++){
                //var idx = seatData.holds.indexOf(pai);
                var idx = -1;
                for(var n = 0; n < seatData.holds.length; n++) {
                    if(i != kind && removeArr[i] == seatData.holds[n]){
                        idx = n;
                        break;
                    }
                }
                //console.log("doChi :seatData.holds :" + seatData.holds + " idx:" + idx);
                if(idx != -1)
                {
                    
                    seatData.holds.splice(idx,1);
                    //console.log("doChi :seatData.holds.splice(idx,1) :" + seatData.holds + " idx:" + idx);
                }
            }                
        }
            
        //更新碰牌数据
        var chis = seatData.chis;
        chis.push(pai - kind);

        this.dispatchEvent('chi_notify',seatData);


        this.pickCardAfterOptFromFolds();
    },

    getGangType:function(seatData,pai){

            var idx = -1;
            utils.alertObj(seatData.pengs,"gamenet 1639");
            for(var n = 0; n < seatData.pengs.length; n++) {
                if( pai == seatData.pengs[n]){
                    idx = n;
                    break;
                }
            }
            console.log("getGangType :seatData.pengs :" + seatData.pengs + " idx:" + idx);
        if(idx != -1){
        //if(seatData.pengs.indexOf(pai) != -1){
            return "wangang";
        }
        else{
            var cnt = 0;
            for(var i = 0; i < seatData.holds.length; ++i){
                if(seatData.holds[i] == pai){
                    cnt++;
                }
            }
            if(cnt == 3){
                return "diangang";
            }
            else{
                return "angang";
            }
        }
    },
    
    doGang:function(seatIndex,pai,gangtype){
        var seats = this.getSeats();
        var seatData = seats[seatIndex];
        // var backup = null;
        // var backupPengs = null;
        // if(seatData.holds){
        //     backup = seatData.holds.concat();
        // }
        
        // var removecount = 0;

        if(!gangtype){
            gangtype = this.getGangType(seatData,pai);
        }
        
        if(gangtype == "wangang"){
            var idx = -1;
            for(var n = 0; n < seatData.pengs.length; n++) {
                if( pai == seatData.pengs[n]){
                    idx = n;
                    break;
                }
            }
            console.log("doGang :seatData.pengs :" + seatData.pengs + " idx:" + idx);
            if(idx != -1){
                //backupPengs = seatData.pengs.concat();
            //if(seatData.pengs.indexOf(pai) != -1){
                //var idx = seatData.pengs.indexOf(pai);
                //if(idx != -1){
                    utils.alertObj(seatData.pengs,"gamenet 1698");
                    seatData.pengs.splice(idx,1);
                    console.log("doGang :seatData.pengs.splice(idx,1) :" + seatData.pengs + " idx:" + idx);
                //}

                //removecount++;
            }
            // if(removecount != 1){
            //     if(backupPengs){seatData.pengs = backupPengs.concat();}
            //     cc.error("GameNetMgr dowangang holds splice removecount failed" + seatData.holds + " removecount" + removecount);
            //     return;
            // }
            seatData.wangangs.push(pai);
            //removecount = 0; 
        }
        if(seatData.holds){
            for(var i = 0; i <= 4; ++i){
                //var idx = seatData.holds.indexOf(pai);
                var idx = -1;
                for(var n = 0; n < seatData.holds.length; n++) {
                    if( pai == seatData.holds[n]){
                        idx = n;
                        break;
                    }
                }
                console.log("doGang :seatData.holds :" + seatData.holds + " idx:" + idx);
                if(idx == -1){
                    //如果没有找到，表示移完了，直接跳出循环
                    
                    break;
                }
                seatData.holds.splice(idx,1);
                //removecount++;
                console.log("doGang :seatData.holds.splice(idx,1) :" + seatData.holds + " idx:" + idx);
            }
            // console.log("doGang removecount:" + removecount + " gangtype:" + gangtype);
            // if((removecount != 1 && gangtype == "wangang") || ( removecount != 3 && gangtype == "diangang" ) || ( removecount != 4 && gangtype == "angang")){
            //     if(backup){seatData.holds = backup.concat();}
            //     cc.error("GameNetMgr doangang or diangang  removecount:"+removecount);
            //     cc.error("GameNetMgr doangang or diangang holds splice removecount failed" + seatData.holds);
            //     return;
            // }
        }
        if(gangtype == "angang"){

            //check angang数据中是否有重复的牌，
            console.log("angang :" + seatData.angangs);
            // for(var j = 0;j< seatData.angangs.length;j++)
            // {
            //     console.log("angang seatData.angangs["+j+"]:" + seatData.angangs[j] + " pai:" + pai + " =?:" + (seatData.angangs[j] == pai));
            //     if(seatData.angangs[j] == pai)
            //     {
            //         cc.error("GameNetMgr do angang repeat !!!");
            //         return;
            //     }
            // }

            seatData.angangs.push(pai);
        }
        else if(gangtype == "diangang"){

            //check diangang数据中是否有重复的牌，
            // for(var j = 0;j< seatData.diangangs.length;j++)
            // {
            //     if(seatData.diangangs[j] == pai)
            //     {
            //         cc.error("GameNetMgr do diangangs repeat !!!");
            //         return;
            //     }
            // }

            seatData.diangangs.push(pai);
            this.pickCardAfterOptFromFolds();
        }
        this.dispatchEvent('gang_notify',{seatData:seatData,gangtype:gangtype});

    },

    doMammonCard: function (data) {
        var seats = this.getSeats();
        var seatData;
        if (cc.vv.replayMgr.isReplay())
            seatData = seats[data.userId];
        else
            seatData = this.getSeatByID(data.userId);
        seatData.mammonCard.push(data.pai);
        this.dispatchEvent('mammonCard', data);
    },

    doHu:function(data){
        var seatIndex = data.seatindex;
        this.seats[seatIndex].hued = true;
        if(cc.vv.gameNetMgr.conf.type == "xlch"){}
        else{
            this.seats[seatIndex].huedPai = data.hupai;
        }
        this.dispatchEvent('hupai',data);
        this.pickCardAfterOptFromFolds();
    },

    
    
    doTurnChange:function(si/*, lastTurnHuStatus*/){
        var data = {
            last:this.turn,
            turn:si,
            //lastTurnHued:lastTurnHuStatus,
        }
        console.log()
        this.turn = si;
        this.chupaiCount = 0;
        this.chiCount = 0;
        this.pengCount = 0;
        this.gangCount = 0;
        this.dispatchEvent('game_chupai',data);
    },
    
    connectGameServer:function(data){
        this.dissoveData = null;
        cc.vv.net.ip = data.ip + ":" + data.port;
        console.log(cc.vv.net.ip);
        var self = this;

        var onConnectOK = function(){
            console.log("onConnectOK");
            var sd = {
                token:data.token,
                roomid:data.roomid,
                time:data.time,
                sign:data.sign,
            };
            cc.vv.net.send("login",sd);
        };
        
        var onConnectFailed = function(){
            console.log("failed.");
            cc.vv.wc.hide();
        };
        cc.vv.wc.show("");//正在进入房间");
        cc.vv.net.connect(onConnectOK,onConnectFailed);
    },

    //清除gameNetMgr的数据
    cleanGameNetMgrData: function () {
        var self = cc.vv.gameNetMgr;
        self.roomId = null;
        self.turn = -1;
        self.dingque = -1;
        self.isDingQueing = false;
        self.seats = null;
        self._chatLog = [];
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    pickCardAfterOptFromFolds:function(){
        var t = this.turn;
        var seats = this.getSeats();
        var seatData = seats[t];
        console.log("pickCardAfterOptFromFolds  turn:" + this.turn + " chupai:" + this.chupai + " seatData.folds:" + seatData.folds)
        //弃牌被碰、杠、胡了，从弃牌堆中移出

        if(this.chupai > -1 && t > -1) {
            
            if(seatData.folds[seatData.folds.length-1] == this.chupai){
                console.log("pickCardAfterOptFromFolds do turn:" + this.turn + " chupai:" + this.chupai + " seatData.folds:" + seatData.folds)
                seatData.folds.pop();
                this.dispatchEvent('game_takefrom_fold',seatData);
            }
        }
    },

    // //避免未知BUG多次调用
    // avoidBugRevMulti:function(cardValue, opKind,seatIndex){
    //     console.log("avoidBugRevMulti: " + opKind +" seatIndex:" + seatIndex + " cardValue:" + cardValue);
    //     var cardCount = 0;
    //     var seats = this.getSeats();
    //     if(opKind == "outcard" && seatIndex != null){
    //         // for(var i = 0; i < this.seats.length; i++){
    //         //     for(var m = 0; m < this.seats[i].folds.length; m++){
    //         //         if(this.seats[i].folds[m] == cardValue){
    //         //             cardCount ++;
    //         //         }
    //         //     }
    //         // }
    //         // if(cardCount < 4){
    //         //     return true;
    //         // }
    //         var seatData = seats[seatIndex];
    //         cardCount += seatData.holds.length;
    //         cardCount += seatData.pengs.length * 3;
    //         cardCount += seatData.angangs.length * 3;
    //         cardCount += seatData.wangangs.length * 3;
    //         cardCount += seatData.diangangs.length * 3;
    //         if(cc.vv.global.selectGameTypeId == 10001){
    //             cardCount += seatData.chis.length * 3;
    //         }
    //         if(cardCount == 14){
    //             console.log("avoidBugRevMulti cardCount:" + cardCount);
    //             return true;
    //         }
    //     }
    //     else if(opKind == "peng"){
    //         for(var i = 0; i < seats.length; i++){
    //             for(var m = 0; m < seats[i].pengs.length; m++){
                    
    //                 var a = new Number(seats[i].pengs[i]);
    //                 var b = new Number(cardValue);
    //                 console.log("avoidBugRevMulti pengs[i]" + seats[i].pengs  + " :" +(a == b));
    //                 if( a == b ){
    //                     cardCount ++;
    //                 }
    //             }
    //         }
    //         if(cardCount == 0){
    //             console.log("avoidBugRevMulti cardCount:" + cardCount);
    //             return true;
    //         }
    //     }
    //     else if(opKind == "gang"){
    //         for(var i = 0; i < seats.length; i++){
    //             for(var m = 0; m < seats[i].angangs.length; m++){
    //                 var a = new Number(seats[i].angangs[i]);
    //                 var b = new Number(cardValue);
    //                 if( a == b ){
    //                     cardCount ++;
    //                 }
    //             }
    //             for(var m = 0; m < seats[i].wangangs.length; m++){
    //                 var a = new Number(seats[i].wangangs[i]);
    //                 var b = new Number(cardValue);
    //                 if( a == b ){
    //                     cardCount ++;
    //                 }
    //             }
    //             for(var m = 0; m < seats[i].diangangs.length; m++){
    //                 var a = new Number(seats[i].diangangs[i]);
    //                 var b = new Number(cardValue);
    //                 if( a == b ){
    //                     cardCount ++;
    //                 }
    //             }
    //         }
    //         if(cardCount == 0){
    //             console.log("avoidBugRevMulti cardCount:" + cardCount);
    //             return true;
    //         }
    //     }
    //     console.log("avoidBugRevMulti false cardCount:" + cardCount);
    //     return false;
    // },

// 将长整数数据转换成时间格式
    dateFormat:function(time){
       var date = new Date(time);
        var datetime = "{0}-{1}-{2} {3}:{4}:{5}";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month >= 10? month : ("0"+month);
        var day = date.getDate();
        day = day >= 10? day : ("0"+day);
        var h = date.getHours();
        h = h >= 10? h : ("0"+h);
        var m = date.getMinutes();
        m = m >= 10? m : ("0"+m);
        var s = date.getSeconds();
        s = s >= 10? s : ("0"+s);
        datetime = datetime.format(year,month,day,h,m,s);
        return datetime;
    },
});
module.exports = new GameNetMgr();