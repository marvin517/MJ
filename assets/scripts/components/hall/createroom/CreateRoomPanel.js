cc.Class({
    extends: cc.Component,

    properties: {
        _instanceCreateRoomPage:[],
        PrefCreateRoomPage:{
           default: [],
           type:cc.Prefab,
        },

        //房间规则
        type:0,
        difen:1,
        zimo:0,
        jushuxuanze:4,
        zuidafanshu:3,
        huansanzhang:false,  
        jiangdui:false,
        menqing:false,
        tiandihu:false,
        hujiaozhuanyi:false,
        badaotang:false,

        koufangka:false,
    },

    // use this for initialization
    onLoad: function () {
        this.init();
        cc.vv.GlobalMsg.AddObserver(this);
    },
    init:function()
    {
        //c初始化默认规则
        //类型选择
        this.type = "dzmj";
        this.difen = 1;
        this.jushuxuanze=4;
        this.zuidafanshu=3;
        this.zimo=0;

        this.huansanzhang = false;      
        this.jiangdui = false;
        this.menqing = false;
        this.tiandihu = false;
        this.hujiaozhuanyi = false;
        this.badaotang = false;
        this.koufangka=false;
    },
    MssageHandle:function(msgtype,parm)
    {
        var self = this;
        console.log("login msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.MessageType.CheckType_jushu:
            {
                this.setjushu(parm);
                console.log("this.jushuxuanze:"+this.jushuxuanze);
            }
            break;
            case cc.vv.GLGameDefine.MessageType.CheckType_fengdin:
            {
                this.setfengdin(parm);
                console.log("this.zuidafanshu:"+this.zuidafanshu);
            }
            break;
            case cc.vv.GLGameDefine.MessageType.CheckType_wanfa:
            {

            }
            break;
            case cc.vv.GLGameDefine.MessageType.CheckType_jiadifan:
            {
                this.setzimo(parm);
                console.log("this.zimo:"+this.zimo);
            }
            break;
            case cc.vv.GLGameDefine.MessageType.CheckType_type:
            {

            }
            break;
            case cc.vv.GLGameDefine.MessageType.CheckType_difen:
            {
                this.setdifen(parm);
            }
            break;
            case cc.vv.GLGameDefine.MessageType.CheckType_AAkou:
            {
                this.setAAkou(parm);
                console.log("this.koufangka:"+this.koufangka);
            }
            break;
            
            default:
            break;
        }
    },
    setAAkou:function(parm)
    {
        try {
            this.koufangka=parm[0];
        } catch (error) {
            this.koufangka=false;
            cc.vv.global.ShowErrorMsg("setwanfa Failed:"+JSON.stringify(error.message));
        }
    },
    //设置玩法
    setwanfa:function(parm)
    {
        try {
            this.huansanzhang = parm[0];        
            this.jiangdui = parm[1];
            this.menqing = parm[2];
            this.tiandihu = parm[3];
            this.hujiaozhuanyi = parm[4];
            this.badaotang = parm[5];
        } catch (error) {
            cc.vv.global.ShowErrorMsg("setwanfa Failed:"+JSON.stringify(error.message));
        }
        
    },
    setdifen:function()
    {
        //this.difen
    },
    //设置自摸加底，还是自摸加番
    setzimo:function(parm)
    {
        try {
            for(var i = 0; i < parm.length; ++i){
                if(parm[i] == true){
                    this.zimo = i;
                    break;
                }     
            }
        } catch (error) {
            this.zimo=0;
            cc.vv.global.ShowErrorMsg("setzimo Failed:"+JSON.stringify(error.message));
        }
        
    },
    //设置封顶
    setfengdin:function(parm)
    {
        try {
            var fanshu = [3,4,5];
            for(var i = 0; i < parm.length; ++i)
            {
                if(parm[i] == true){
                    this.zuidafanshu = fanshu[i];
                    break;
                }
            }
        } catch (error) {
            this.zuidafanshu = 3;
            cc.vv.global.ShowErrorMsg("setfengdin Failed:"+JSON.stringify(error.message));
        }
        
    },
    //设置局数
    setjushu:function(parm)
    {
        try {
            var jushulist = [4,8];
            for (var index = 0; index < parm.length; index++) {
                if(parm[index] == true)
                {
                    this.jushuxuanze=jushulist[index];
                    break;
                }
            }
        } catch (error) {
            //如果出错，默认选4
            this.jushuxuanze=4;
            cc.vv.global.ShowErrorMsg("setjushu Failed:"+JSON.stringify(error.message));
        }
        
    },
    createroomByRule:function()
    {
        try {
            //房间规则
            var conf = {
                type: this.type,
                difen: this.difen,
                
                jushuxuanze: this.jushuxuanze,
                zuidafanshu: this.zuidafanshu,
                zimo: this.zimo,
                dianganghua: 0,
                huansanzhang: this.huansanzhang,
                jiangdui: this.jiangdui,
                daiyaojiu: this.jiangdui,
                menqing: this.menqing,
                zhongzhang: this.menqing,
                tiandihu: true,
                hujiaozhuanyi: this.hujiaozhuanyi,
                badaotang: this.badaotang,

                koufangka: this.koufangka,
                renshu: 3,
                sanRenLiangFang:true,
            }; 
            console.log("Rule :" + JSON.stringify(conf));
            
            var la = cc.sys.localStorage.getItem("myLatitude");
            var lo = cc.sys.localStorage.getItem("myLongitude");
            var la2 = parseFloat(la);
            var lo2 = parseFloat(lo);
            // ///模拟数据
            if(cc.sys.os != cc.sys.OS_ANDROID && cc.sys.os != cc.sys.OS_IOS)
            {
                la2 = Math.random()*10;
                lo2 = Math.random()*10;  
            }   
            //构建 建房数据
            var data = {
                ip:cc.vv.userMgr.ip,
                conf:JSON.stringify(conf),
                la:la2,
                lo:lo2,
            };
            //显示正在创建房间
            cc.vv.wc.show("");//正在创建房间");
            console.log("createroom data:"+JSON.stringify(data));
            cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.HallcreateRoom, data);
            //cc.vv.allRequest.thirdRequest("hall.roomHandler.createRoom",data, onCreate, failFun);
        } catch (error) {
            cc.vv.global.ShowErrorMsg("setjushu Failed:"+JSON.stringify(error.message));
        }
        
       
    },
    showPage:function (TabIndex) {
        if (TabIndex < 0) {
            return;
        }
        console.log("onClickTabBtn :" + TabIndex);
        var prefab = null;
        var instance = null;
        prefab = this.PrefCreateRoomPage[TabIndex];
        instance = this._instanceCreateRoomPage[TabIndex];

        if (instance == null) {
            instance = cc.instantiate(prefab);
            this._contentNode.addChild(instance);
            this._instanceCreateRoomPage[TabIndex] = instance;
        }
        
        for(var createrule in this._instanceCreateRoomPage){
            if(this._instanceCreateRoomPage[createrule] == instance){
                this._instanceCreateRoomPage[createrule].active = true;
            }
            else{
                this._instanceCreateRoomPage[createrule].active = false;
            }
        }
        
    },
    onDestroy:function()
    {
        cc.vv.GlobalMsg.RemoveObserver(this);
    },
});
