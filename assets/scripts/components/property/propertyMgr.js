var propertyMgr = cc.Class({
    extends: cc.Component,

    properties: {
        Allgoods: [],
    },

    // use this for initialization
    onLoad: function () {

    },
    init:function()
    {
        this.Allgoods = [];
    },
    //
    updataGoldCoins:function(num)
    {
        var goodsitem = require("goodsitem");
        var coinitem = new goodsitem();
        coinitem.goodsID = cc.vv.global.GoodsType.goldcoins;
        coinitem.goodsDes = "goldcoins";
        coinitem.goodsNum = cc.vv.userMgr.coins;
        coinitem.goodsType = cc.vv.global.GoodsType.goldcoins;
        this.addgoodsItem(coinitem);
    },
    updataDiamonds:function()
    {
        var goodsitem = require("goodsitem");
        var pitem = new goodsitem();
        pitem.goodsID = cc.vv.global.GoodsType.diamonds;
        pitem.goodsDes = "diamond";
        pitem.goodsNum = cc.vv.userMgr.gems;
        pitem.goodsType = cc.vv.global.GoodsType.diamonds;
        this.addgoodsItem(pitem);
    },
    //默认为propertyitem结构
    addgoodsItem:function(data)
    {
        cc.vv.global.Debuglog("addgoodsItem data.goodsType:"+data.goodsID);
        cc.vv.global.Debuglog("addgoodsItem data.goodsType:"+JSON.stringify(data.goodsDes));
        cc.vv.global.Debuglog("addgoodsItem data.goodsType:"+data.goodsNum);
        cc.vv.global.Debuglog("addgoodsItem data.goodsType:"+JSON.stringify(data.goodsType));
        //不同类型，通知之前的数据
        cc.vv.global.Debuglog("addgoodsItem data.goodsType:"+data.goodsType);
        switch(data.goodsType)
        {
            case cc.vv.global.GoodsType.goldcoins:
            {
                cc.vv.userMgr.coins = data.goodsNum;
                cc.vv.global.Debuglog("addgoodsItem coins:"+JSON.stringify(cc.vv.userMgr.coins));
                cc.vv.GlobalMsg.Send("buySucess");
                cc.vv.GlobalMsg.Send("shopbuySucess");
            }
            break;
            case cc.vv.global.GoodsType.diamonds:
            {
                cc.vv.userMgr.gems = data.goodsNum;
                cc.vv.global.Debuglog("addgoodsItem gems:"+JSON.stringify(cc.vv.userMgr.gems));
                cc.vv.GlobalMsg.Send("buySucess");
                cc.vv.GlobalMsg.Send("shopbuySucess");
            }
            break;

            default:
            break;
        }

        if(this.GetgoodsByID(data.goodsID) == null)
        {
            this.Allgoods.push(data);
        }
        else
        {
            this.addGoodsItemNum(data);
        }
        this.DebugLogAllgoods();
        //解析具体物品，刷新UI
        //if()
    },
    GetgoodsByID:function(id)
    {
        //test output
        for(var i = 0;i < Object.keys(this.Allgoods).length;i++)
        {
            cc.vv.global.Debuglog("goods:"+JSON.stringify(this.Allgoods[i]));
            if(this.Allgoods[i].goodsID == id)
            {
                return this.Allgoods[i];
            }
        }
        cc.error("this.GoodsList do not have id:"+id);
        return null;
    },
    addGoodsItemNum:function(data)
    {
        for(var i = 0;i < Object.keys(this.Allgoods).length;i++)
        {
            if(this.Allgoods[i].goodsType == data.goodsType)
            {
                this.Allgoods[i].goodsNum = this.Allgoods[i].goodsNum + data.goodsNum;
                cc.vv.global.Debuglog("addGoodsItemNum goodsNum:"+JSON.stringify(this.Allgoods[i].goodsNum));
            }
        }
    },
    DebugLogAllgoods:function()
    {
        for(var i = 0;i < Object.keys(this.Allgoods).length;i++)
        {
            cc.vv.global.Debuglog("propertyMgr DebugLogAllgoods:"+JSON.stringify(this.Allgoods[i].goodsID));
            cc.vv.global.Debuglog("propertyMgr DebugLogAllgoods:"+JSON.stringify(this.Allgoods[i].goodsDes));
            cc.vv.global.Debuglog("propertyMgr DebugLogAllgoods:"+JSON.stringify(this.Allgoods[i].goodsNum));
            cc.vv.global.Debuglog("propertyMgr DebugLogAllgoods:"+JSON.stringify(this.Allgoods[i].goodsType));
        }
    },
});
module.exports = new propertyMgr();