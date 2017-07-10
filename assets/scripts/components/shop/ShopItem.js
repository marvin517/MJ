cc.Class({
    extends: cc.Component,

    properties: {
       uiitemicon:cc.Sprite,        //商品图片
       uiitemprice:cc.Label,        //商品价格
       uiitemdis:cc.Label,          //商品描述
       uiitemdnum:cc.Label,         //商品数量
       uiitemddiscount:cc.Label,    //商品打折
       m_itemid:1,
       m_id:1,
       m_index:0,                   //IOS内购需要指定位置

       shopAtlas:{
            default:null,
            type:cc.SpriteAtlas
        },
    },
    
    // use this for initialization
    //加载资源，初始化变量
    onLoad: function () {
        this.uiitemprice.string = "0";
        this.uiitemdis.string = "商品描述";
        this.uiitemdnum.string = "0";
        this.uiitemddiscount.string = "1";
        this.m_id = "0";
        this.m_itemid = "0";
    },

    //数据设置
    SetShopItem:function(data)
    {
        console.log("ShopItem SetShopItem data:"+JSON.stringify(data));
        var self = this;
        this.uiitemprice.string = data.price+"元";
        this.uiitemdis.string = data.description;
        this.uiitemdnum.string = data.number+"钻石";
        this.uiitemddiscount.string = data.discount;
        this.m_id = data.id;
        //6张图片，不能越界
        if(this.m_id < 1)
            this.m_id = 1;
        if(this.m_id > 6)
            this.m_id = 6;
        this.m_itemid = data.itemId;

        this.RefreshUI(data);
    },
    //UI刷新
    RefreshUI:function(data)
    {
        //设置icon图片
        var self = this;
        var spf = this.shopAtlas.getSpriteFrame("item"+data.id);

        if(spf != null)
        {
            console.log("ShopItem SetShopItem data:"+JSON.stringify(data.id));
            self.node.getChildByName("itemicon").getComponent(cc.Sprite).spriteFrame = spf;
        }


        // cc.loader.loadRes("textures/hall/shop/item"+data.id, cc.SpriteFrame, function (err, spriteFrame) 
        // {
        //     if(err == null)
        //     {
        //     self.node.getChildByName("itemicon").getComponent(cc.Sprite).spriteFrame = spriteFrame;
        //     }
            
        //     //self.uiitemicon = spriteFrame;
        // });
    },
    BuyItem:function(event)
    {
        cc.vv.global.BuyID = this.m_index;

        // var goods = cc.vv.global.GetGoodsByID(cc.vv.global.BuyID);
        // cc.vv.global.Debuglog("ShopItem Debuglog:cc.vv.global.BuyID:"+cc.vv.global.BuyID);
        // cc.vv.global.Debuglog("ShopItem Debuglog:goods.itemId:"+goods.itemId);
        // cc.vv.global.Debuglog("ShopItem Debuglog:goods.number:"+goods.number);

        // cc.vv.http.sendRequest("charge.chargeHandler.givePlayerItem",{"itemId": goods.itemId,"number":goods.number},function(data)
        // {
        //     console.log("ShopItem IOS付费成功，向自己服务器发送验证信息，并收取回调");
        //     console.log("ShopItem data:"+JSON.stringify(data));
        //     console.log("ShopItem data:"+JSON.stringify(data.data));
        //     cc.vv.userMgr.gems = data.data;
        //     cc.vv.GlobalMsg.Send("buySucess");

        // });

        if(cc.vv.global.PayType == 0)
        {
            //审核版本，直接向苹果发起内购支付
            cc.vv.anysdkMgr.BuyProductFromIOS(this.m_id);//根据id，发起指定支付请求
        }
        else
        {
            //调用UI
            cc.vv.hall.pryroot.active = true;


            // var successFun = function (ret) {
            //     if (ret.code == cc.vv.global.MessageType.NetSucess) {
            //         cc.vv.wc.hide();
            //         cc.vv.anysdkMgr.BuyProductFromWX(ret.data);
            //     } else if (ret.code == cc.vv.global.MessageType.NetError) {
            //         cc.vv.wc.hide();
            //         cc.vv.alert.show("提示", ret.errorMessage);
            //     }
            // }

            // var failFun = function () {
            //     cc.vv.wc.hide();
            //     cc.vv.alert.show("提示", "消息发送超时！请检查网络后重试");
            // }

            // cc.vv.wc.show("");
            // cc.vv.allRequest.thirdRequest("charge.chargeHandler.getWechatPayInfo",{"id":this.m_id,paytype:"A01"}, successFun, failFun);


            //向服务器请求微信支付相关信息
            // cc.vv.PomeloNetMgr.RequestWithParams("charge.chargeHandler.getWechatPayInfo",{"id":this.m_id},function(data)
            // {
            //     console.log("getPayUrl data:"+JSON.stringify(data));
            //     //获取支付相关信息,利用BuyProductFromSYB，向OC传递信息，发起微信支付
            //     if(data.code == cc.vv.global.MessageType.NetError)
            //     {
            //         console.log("error: getWechatPayInfo:"+JSON.stringify(data.code));
            //     }
            //     else
            //     {
            //         if(data.code == cc.vv.global.MessageType.NetSucess)
            //         {
            //             console.log("NetSucess: getWechatPayInfo:"+JSON.stringify(data.data));
            //             cc.vv.anysdkMgr.BuyProductFromWX(data.data);
            //         }
            //         else
            //         {
            //             console.log("error: getWechatPayInfo:"+JSON.stringify(data.code));
            //         }
                    
            //     }
            
            // });
        }
        
    },

    SetPos:function(posX,posY)
    {
        this.node.position = cc.p(posX,posY);
    },
    SetIndex:function(_index)
    {
        this.m_index = _index;
    },
});
