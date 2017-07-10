cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        ZFBPayNode:cc.Node,
        WXPayNode:cc.Node,
    },

        // use this for initialization
    onLoad: function () {

        if(cc.vv.global.PayType == 1)
        {
            this.WXPayNode.active = false;
            this.ZFBPayNode.x = 0;
        }

        else if(cc.vv.global.PayType == 2)
        {
            this.ZFBPayNode.active = false;
            this.WXPayNode.x = 0;
        }

        else if(cc.vv.global.PayType == 3)
        {
            this.ZFBPayNode.x = -115;
            this.WXPayNode.x = 115;
        }
    },

    PayByZFB:function()
    {
        cc.vv.hall.pryroot.active = false;

            var successFun = function (ret) {
                cc.vv.global.Debuglog("Debuglog ShopPay:ret:"+JSON.stringify(ret));
                if (ret.code == cc.vv.global.MessageType.NetSucess) {
                    cc.vv.wc.hide();
                    //cc.vv.anysdkMgr.BuyProductFromZFB(ret.data.payURL);            //调用支付宝支付请求
                    cc.sys.openURL(ret.data.payURL);
                } else if (ret.code == cc.vv.global.MessageType.NetError) {
                    cc.vv.wc.hide();
                    cc.vv.alert.show("提示", ret.errorMessage);
                }
            }

            var failFun = function () {
                cc.vv.wc.hide();
                cc.vv.alert.show("提示", "消息发送超时！请检查网络后重试");
            }

            cc.vv.wc.show("");

            var goods = cc.vv.global.GetGoodsByID(cc.vv.global.BuyID);

            cc.vv.global.Debuglog("Debuglog ShopPay:goods.id:"+JSON.stringify(goods.id));//cc.vv.userMgr
            cc.vv.allRequest.thirdRequest("charge.chargeHandler.getUnionPayInfo",{"id":goods.id,paytype:"alipay_h5api",isH5Pay:true,clientIp:cc.vv.userMgr.ip}, successFun, failFun);
    },
    PayByWX:function()
    {
        cc.vv.hall.pryroot.active = false;

            var successFun = function (ret) {
                console.log("processMessage msg"+JSON.stringify(ret));
                
                if (ret.code == cc.vv.global.MessageType.NetSucess) {
                    cc.vv.wc.hide();
                    //cc.vv.anysdkMgr.BuyProductFromWX(ret.data);
                    cc.sys.openURL(ret.data.payURL);
                } else if (ret.code == cc.vv.global.MessageType.NetError) {
                    cc.vv.wc.hide();
                    cc.vv.alert.show("提示", ret.errorMessage);
                }
            }

            var failFun = function () {
                cc.vv.wc.hide();
                cc.vv.alert.show("提示", "消息发送超时！请检查网络后重试");
            }

            cc.vv.wc.show("");

            var goods = cc.vv.global.GetGoodsByID(cc.vv.global.BuyID);
            cc.vv.global.Debuglog("Debuglog ShopPay:goods.id:"+JSON.stringify(goods.id));
            cc.vv.allRequest.thirdRequest("charge.chargeHandler.getUnionPayInfo",{"id":goods.id,paytype:"weixin_h5api",isH5Pay:true,clientIp:cc.vv.userMgr.ip}, successFun, failFun);
    },
});
