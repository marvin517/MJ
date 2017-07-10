cc.Class({
    extends: cc.Component,

    properties: {
        _MsgFun:null,
    },

    // use this for initialization
    onLoad: function () 
    {
        var self = this;
        this._MsgFun = function(msgtype,data)
        {
            self.MssageHandle(msgtype,data);
        };
        //cc.vv.GlobalMsg.Register("GameMgrMSG", this._MsgFun);
        cc.vv.GlobalMsg.RegisterWithTarget("GameMgrLMSG", this.MssageHandle,this);
    },
    MssageHandle:function(node,msgtype,data)
    {
        var self = node;
        console.log("LMssageHandle msgtype:"+msgtype+","+"parm:"+JSON.stringify(data));
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.MessageType.ButtonClick:
            {
                console.log("data:",data);
                self.BTMssageHandle(data);
            }
            break;
        }
    },
    BTMssageHandle:function(prePath)
    {
        console.log("prePath:"+prePath);
        var self =this;
        switch(prePath)
        {
            case "btn_settings":{}break;
            default:
            break;
        }
        //预制名称，最好是预制路径
        const nodes = cc.vv.nodePoolMgr.getNode(prePath,prePath,(obj, reKey) => 
        {
            console.log("reKey:"+JSON.stringify(reKey));
            if(prePath === reKey)
            {
                self.node.addChild(obj);
                obj.active = true;
            }

        });
        if (nodes) {
            self.node.addChild(nodes);
            nodes.active = true;
        }
    },
    onDestroy:function()
    {
        //cc.vv.GlobalMsg.Unregister("GameMgrMSG", this._MsgFun);
        cc.vv.GlobalMsg.UnregisterWithTarget("GameMgrLMSG", this.MssageHandle,this);
    },
});
