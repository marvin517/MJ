cc.Class({
    extends: cc.Component,

    properties: {
        _MsgFun:null,
    },

    onLoad: function () {
        setTimeout(function() {
            this.RegisterListener();
        }, 50);
        
    },
    RegisterListener:function()
    {
        console.log("BaseComponent:RegisterListener");
        var self = this;
        this._MsgFun = function(msgtype,data)
        {
            self.MssageHandle(msgtype,data);
        };
        cc.vv.GlobalMsg.Register("GameMgrLMSG", this._MsgFun);
    },
    MssageHandle:function(msgtype,parm)
    {
        console.log("msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
        switch(msgtype)
        {
            case "NULL":
            {
                console.log("NULL parm:",parm);
            }
            break;
            default:
            break;
        }
    },
    onDestroy:function()
    {
        this.UnRegisterListener();
    },
    UnRegisterListener:function()
    {
        console.log("BaseComponent:UnRegisterListener");
       cc.vv.GlobalMsg.Unregister("GameMgrLMSG", this._MsgFun);
    },
    DebugLog:function(data)
    {
        console.log("BaseComponent DebugLog:"+JSON.stringify(data));
    },
});
