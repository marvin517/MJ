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
        msgitem:{
            default:null,
            type:cc.Prefab
        },
        _MsgFun:null,
        RootNode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        setTimeout(function() {
            
            self._MsgFun = function(msgtype,data)
            {
               self.MssageHandle(msgtype,data);
            };
            cc.vv.GlobalMsg.Register("GameMgrMSG", self._MsgFun);
        }, 20);
        
    },
    start:function(){
        try {
            cc.vv.nodePoolMgr.addNodePool({url:"prefabs/msgitem",count:2,increaseNum:1});
        } catch (error) {
            
        }
        
    },
    MssageHandle:function(msgtype,data)
    {
        console.log("LMssageHandle msgtype:"+msgtype+","+"parm:"+JSON.stringify(data));
        var self = this;
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.MessageType.serverannounce:
            {
                self.AddMsgItem(data);
            }
            break;
        }
    },
    AddMsgItem:function(data)
    {
        var self = this;
        const nodes = cc.vv.nodePoolMgr.getNode("prefabs/msgitem","prefabs/msgitem",(obj, reKey) => 
        {
            try {
                if("prefabs/msgitem" === reKey)
                {
                    self.node.addChild(obj);
                    // self.RootNode = cc.find("Canvas");
                    // self.RootNode.addChild(obj,10000);
                    obj.active = true;
                    //obj.setPosition(200,300);
                    var msgitem = obj.getComponent("msgitem");
                    msgitem.SetMsg(data);
                }
            } catch (error) {
                cc.vv.global.ShowErrorMsg("AddMsgItem initPointer Failed:"+JSON.stringify(error.message));
            }
            
        });
    },
    onDestroy:function(){
        cc.vv.GlobalMsg.Unregister("GameMgrMSG", this._MsgFun);
    },



    test:function()
    {
        cc.vv.GlobalMsg.SendMsg(10230);
    },
    test2:function()
    {
        cc.vv.GlobalMsg.SendMsg(10231);
    },
});
