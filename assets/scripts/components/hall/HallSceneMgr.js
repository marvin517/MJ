
cc.Class({
    extends: cc.Component,

    properties: {
        _MsgFun:null,

        ///////////////////////////////////////////////////////////////
        shopnode: cc.Node,
        joinNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        // var self = this;
        // this._MsgFun = function(msgtype,data)
        // {
        //     self.MssageHandle(msgtype,data);
        // };
        // cc.vv.GlobalMsg.Register("GameMgrMSG", this._MsgFun);
        cc.vv.GlobalMsg.AddObserver(this);
    },
    //初始化所有UI节点
    init:function()
    {

    },
    MssageHandle:function(msgtype,data)
    {
        console.log("LMssageHandle msgtype:"+msgtype+","+"parm:"+JSON.stringify(data));
        var self = this;
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.MessageType.ButtonClick:
            {
                console.log("data showshop:",data);
                this.BtnMsgHandle(data);
            }
            break;
        }
    },
    BtnMsgHandle:function(BtnType)
    {
        switch(BtnType)
        {
            case cc.vv.GLGameDefine.BTNMsgType.hall_showshop:
            {
                if(this.shopnode)
                {
                    this.shopnode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showinvate:
            {
                this.AddChildOn("prefabs/inviteCode");
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showDeleget:
            {
                this.AddChildOn("prefabs/ApplyAgent");
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showhistory: {
                const ui_root = cc.find("Canvas");
                const historyNode = cc.vv.nodePoolMgr.getNode("prefabs/history", "prefabs/history", (obj) => {
                    if (ui_root) {
                        ui_root.addChild(obj);
                        obj.active = true;
                    }
                });
                if (historyNode) {
                    ui_root.addChild(historyNode);
                    historyNode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showsetting: {
                const ui_root = cc.find("Canvas");
                const settingsNode = cc.vv.nodePoolMgr.getNode("prefabs/settings", "prefabs/settings", (obj) => {
                    if (ui_root) {
                        ui_root.addChild(obj);
                        obj.active = true;
                    }
                });
                if (settingsNode) {
                    ui_root.addChild(settingsNode);
                    settingsNode.active = true;
                }
            }
            break;
            default: {
                cc.log("unkown BtnType: ", BtnType);
            }
        }
    },
    AddChildOn:function(key)
    {
        var self = this;
        const nodes = cc.vv.nodePoolMgr.getNode(key,key,(obj, reKey) => 
        {
            if(key === reKey)
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
    onDestroy:function(){
        //cc.vv.GlobalMsg.Unregister("GameMgrMSG", this._MsgFun);
        cc.vv.GlobalMsg.RemoveObserver(self);
    },
});
