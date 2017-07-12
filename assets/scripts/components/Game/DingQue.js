cc.Class({
    extends: cc.Component,

    properties: {
        DQList:{
            default:[],
            type:[cc.Node]
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.GlobalMsg.AddObserver(this);
    },
    //显示定缺,data为推荐选项
    ShowDingQue:function(data)
    {

    },
    MssageHandle:function(msgtype,parm)
    {
        var self = this;
        console.log("login msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.MessageType.game_showdingque:
            {
                
            }
            break;
            default:
            break;
        }
    },
    ChooseDingQue:function(chooseindex)
    {
        for (var index = 0; index < this.DQList.length; index++) {
            if(index == chooseindex)
            {
                this.DQList[index].active=true;
            }
            else
            {
                this.DQList[index].active=false;
            }
        }
        this.DQList[index]
    },
    onDestroy:function()
    {
        cc.vv.GlobalMsg.RemoveObserver(this);
    },

});
