var Global = require("Global")

var Shop = cc.Class({
    extends: cc.Component,
    properties: {
        lblDiamonds:cc.Label,
        lblGolds:cc.Label,
        content:cc.Node,
        viewitemTemp:cc.Prefab,
        btnback:cc.Button,
        calllable:cc.Label,
        goldNumNode:cc.Node,
        callNode:cc.Node,
        _updatehandle:null,
    },
    onLoad: function () 
    {
        this.lblDiamonds.string = cc.vv.userMgr.gems;
        this.lblGolds.string = cc.vv.userMgr.coins;
        cc.vv.utils.addClickEvent(this.btnback,this.node,"Shop","onBtnClicked");
        var self = this;
        this._updatehandle = function()
        {
            self.updateInfo();
        }
        cc.vv.GlobalMsg.Register("shopbuySucess", this._updatehandle);
        if(cc.vv.global.ReviewVersion)
            this.node.getChildByName("all").getChildByName("btn_yaoqingma").active = false;

        // cc.loader.loadRes("prefabs/shopItem", function (err, prefab) //加载预制
        // {
        //     console.log("load prefabs/shopItem");
        //     self.viewitemTemp = prefab;//指向预制，用到时实例化
        //     //self.test();
        //     self.getAllSaleItems();
        // });
        //this.getAllSaleItems();

    }, 
    updateInfo: function () {
        cc.vv.global.Debuglog("Debuglog:updateInfo :"+cc.vv.userMgr.gems);
        this.lblDiamonds.string = cc.vv.userMgr.gems;
        this.lblGolds.string = cc.vv.userMgr.coins;
    },
    onEnable:function(){
        ///审核版本屏蔽金币显示
        //if(cc.vv.global.ReviewVersion == true)
        // {
        //     this.goldNumNode.active = false;
        //     this.callNode.active = false;
        // }

        this.lblDiamonds.string = cc.vv.userMgr.gems;
        this.lblGolds.string = cc.vv.userMgr.coins;
        this.getAllSaleItems();
    },
    
    onBtnClicked:function(event){
        this.node.active = false;
    },
    //测试   
    test:function(){
        var self = this;
       var item1={"id":1,"itemId":1,"number":3,"price":1,"discount":9,"description":"钻石"};
       var item2={"id":2,"itemId":2,"number":5,"price":5,"discount":8,"description":"钻石"};
       var item3={"id":3,"itemId":3,"number":10,"price":20,"discount":6,"description":"钻石"};
       var item4={"id":4,"itemId":4,"number":15,"price":30,"discount":5,"description":"钻石"};
       var item5={"id":5,"itemId":5,"number":25,"price":80,"discount":4,"description":"钻石"};
       var item6={"id":6,"itemId":6,"number":100,"price":120,"discount":95,"description":"钻石"};
       var ss = [];
       ss.push(item1);
       ss.push(item2);
       ss.push(item3);
       ss.push(item4);
       ss.push(item5);
       ss.push(item6);

       var width = -1;

       for (var i = 0; i < ss.length; i++) {
           //if(i % 2 == 0)
            width++;
           var shopItemobj = cc.instantiate(self.viewitemTemp);
           self.content.addChild(shopItemobj);

           var shopItem = shopItemobj.getComponent("ShopItem");

           shopItem.SetShopItem(ss[i]);

           shopItem.SetPos(120 + 270 * width, -110 - 220 * i);
       }
       self.content.width = ((width + 1) * 200 < 850) ? 850 : (width + 1) * 200;
    },    
    GetData:function()
    {
        var data={};
        var item1={"id":1,"itemId":2,"number":5,"price":6,"discount":1,"description":"少量钻石"};
       var item2={"id":2,"itemId":2,"number":16,"price":30,"discount":1,"description":"一小堆钻石"};
       var item3={"id":3,"itemId":2,"number":27,"price":60,"discount":1,"description":"一堆钻石"};
       var item4={"id":4,"itemId":2,"number":50,"price":188,"discount":1,"description":"一大堆钻石"};
       var item5={"id":5,"itemId":2,"number":178,"price":288,"discount":1,"description":"一大袋钻石"};
       var item6={"id":6,"itemId":2,"number":600,"price":648,"discount":1,"description":"一大箱钻石"};

       var ss = [];
       ss.push(item1);
       ss.push(item2);
       ss.push(item3);
       ss.push(item4);
       ss.push(item5);
       ss.push(item6);
       data.items=ss;
       data.telephone="如果支付有问题，请联系客服:XXXXXXXXXXX";
       return data;
    },
    addPendingOrder : function(itemid)
    {
        var self = this;
        //构建 数据
        var data = null;       

        var successFun = function(ret){
            // if(ret.code == cc.vv.global.MessageType.NetSucess){
            //     cc.vv.wc.hide();
 
            // }else if(ret.code == cc.vv.global.MessageType.NetError){
            //     cc.vv.wc.hide();
            //     cc.vv.alert.show("提示",ret.errorMessage);
            // }
        }

        var failFun = function () {
            cc.vv.wc.hide();
            cc.vv.alert.show("提示", "领取金币超时！请检查网络后重试");
        }

        cc.vv.wc.show("");
        cc.vv.allRequest.thirdRequest("charge.chargeHandler.confirmPendingOrder",{"itemId":"1"}, successFun, failFun);
        // //拿到订单，发送到服务器验证
        // cc.vv.PomeloNetMgr.RequestWithParams("charge.chargeHandler.confirmPendingOrder",{"itemId":"1"},function(data)
        // {
        
        // });
    },
    getViewItem: function (index) {
        var content = this.content;
        if (content.childrenCount > index) {
            return content.children[index];
        }
        var node = cc.instantiate(this.viewitemTemp);
        content.addChild(node);
        return node;
    },
    //获取当前服务器所有商品
    getAllSaleItems : function()
    {
        var self = this;       
        var successFun = function(data){
            console.log("getAllSaleItems:data:"+JSON.stringify(data));
            if(data.code == cc.vv.global.MessageType.NetSucess){
                cc.vv.wc.hide();
                if(cc.vv.global.ReviewVersion == true)
                {
                    data.data = self.GetData();
                }
                self.calllable.string = data.data.telephone;
                console.log("Global.MessageType.sucess:"+Object.keys(data.data.items).length);
                cc.vv.global.GoodsList = data.data.items;
                
                var width = -1;//用于记录有多少竖排数据

                //移除多余的子项
                while (self.content.childrenCount > data.data.items.length) {
                    var lastOne = self.content.children[self.content.childrenCount - 1];
                    self.content.removeChild(lastOne, true);
                }
                for(var i = 0;i < Object.keys(data.data.items).length;i++)
                {
                    //if(i % 2 == 0)//一列排放几个
                        width++;

                    // var shopItemobj = cc.instantiate(self.viewitemTemp);//实例化预制
                    // self.content.addChild(shopItemobj);//将 实例化对象 放入 layout
                    var shopItemobj = self.getViewItem(i);
 
                    var shopItem = shopItemobj.getComponent("ShopItem");

                    shopItem.SetShopItem(data.data.items[i]);//设置单个数据
                    shopItem.SetIndex(i);
                    shopItem.SetPos(150 + 270 * width, -200);
                }
                self.content.width = ((width + 1) * 270 < 850) ? 850 : (width + 1) * 270;//layout宽度最小1260，根据列数增加，200为每排宽度

            }else if(data.code == cc.vv.global.MessageType.NetError){
                cc.vv.wc.hide();
                cc.vv.alert.show("提示",data.errorMessage);
            }
        }

        var failFun = function () {
            cc.vv.wc.hide();
            cc.vv.alert.show("提示", "领取金币超时！请检查网络后重试");
        }

        cc.vv.wc.show("");
        cc.vv.allRequest.thirdRequest("charge.chargeHandler.getAllSaleItems",null, successFun, failFun);
        // cc.vv.PomeloNetMgr.RequestWithParams("charge.chargeHandler.getAllSaleItems",null,function(data)
        // {
        //     console.log("getAllSaleItems data:"+JSON.stringify(data));
        //     if(data.code == Global.MessageType.NetError)
        //     {
        //         //获取失败，弹出提示框
        //         console.log("getAllSaleItems Global.MessageType.NetError");
        //     }
        //     else
        //     {
        //         console.log("Global.MessageType.sucess:"+Object.keys(data.data).length);
        //         cc.vv.global.GoodsList = data.data;
                
        //         var width = -1;//用于记录有多少竖排数据

        //         for(var i = 0;i < Object.keys(data.data).length;i++)
        //         {
        //             if(i % 2 == 0)//一列排放几个
        //                 width++;

        //             var shopItemobj = cc.instantiate(self.viewitemTemp);//实例化预制
        //             self.content.addChild(shopItemobj);//将 实例化对象 放入 layout
 
        //             var shopItem = shopItemobj.getComponent("ShopItem");

        //             shopItem.SetShopItem(data.data[i]);//设置单个数据
        //             shopItem.SetIndex(i);
        //             shopItem.SetPos(120 + 270 * width, -110 - 220 * (i % 2));
        //         }
        //         self.content.width = ((width + 1) * 200 < 850) ? 850 : (width + 1) * 200;//layout宽度最小1260，根据列数增加，200为每排宽度
        //     }
        // });
    },

    //request gems  and  golds
    getGems: function () {
        var self = this;
        var failFun = function () {
            cc.vv.wc.hide();
            console.log("我没收到房卡信息了");
        };
        var successFun = function (ret) {
            if (ret.code == 500) {
                cc.vv.wc.hide();
                console.log("房卡信息没给我");
            }
            else {
                cc.vv.wc.hide();
                console.log("Hall getGems ret:"+JSON.stringify(ret));
                cc.vv.userMgr.gems = ret.data.roomCard;
                cc.vv.userMgr.coins = ret.data.coins;
                self.lblDiamonds.string = cc.vv.userMgr.gems;
                self.lblGolds.string = cc.vv.userMgr.coins;
            }
        };
        cc.vv.wc.show("");
        cc.vv.allRequest.thirdRequest("hall.hallHandler.get_room_card", null, successFun, failFun);
    },

    btn_invite:function(){
        this.node.active = false;
        cc.find("Canvas/inviteCode").active = true;
    },
    onDestroy:function(){
        cc.vv.GlobalMsg.Unregister("shopbuySucess", this._updatehandle);
    },
});