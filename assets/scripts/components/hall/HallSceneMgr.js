
cc.Class({
    extends: cc.Component,

    properties: {
        _MsgFun:null,

        ///////////////////////////////////////////////////////////////
        shopnode:cc.Node,
        joinNode:cc.Node,
        settingsNode:cc.Node,
        helpNode:cc.Node,
        historyNode:cc.Node,
        inviteCodeNode:cc.Node,
        payrootNode:cc.Node,
        DelegetNode:cc.Node,
        showshareNode:cc.Node,
        createroomNode:cc.Node,
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
            
            case cc.vv.GLGameDefine.BTNMsgType.hall_createroom:
            {
                if(this.createroomNode)
                {
                    this.createroomNode.active = true;
                }
            }
            break;
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
                if(this.inviteCodeNode)
                {
                    this.inviteCodeNode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showJoin:
            {
                if(this.joinNode)
                {
                    this.joinNode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showhelp:
            {
                if(this.helpNode)
                {
                    this.helpNode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showDeleget:
            {
                if(this.DelegetNode)
                {
                    this.DelegetNode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showhistory: {
                if(this.historyNode)
                {
                    this.historyNode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showsetting: {
                if(this.settingsNode)
                {
                    this.settingsNode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showteahouse: {
                
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showshare: {
                if(this.showshareNode)
                {
                    this.showshareNode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showluckwheel: {
                if(this.shopnode)
                {
                    this.shopnode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showmail: {
                if(this.shopnode)
                {
                    this.shopnode.active = true;
                }
            }
            break;
            case cc.vv.GLGameDefine.BTNMsgType.hall_showpayroot: {
                if(this.payrootNode)
                {
                    this.payrootNode.active = true;
                }
            }
            break;
            
            default: {
                cc.log("unkown BtnType: ", BtnType);
            }
            break;
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
