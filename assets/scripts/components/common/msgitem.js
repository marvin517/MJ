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
            type:cc.RichText
        },
        _actionTime:5,
        index:0,
    },

    // use this for initialization
    onLoad: function () {
        if(this.msgitem != null && this.msgitem != undefined)
        {
            this.msgitem.string ="";
        }
        this._actionTime = 5;
        cc.vv.GlobalMsg.AddObserver(this);
    },
    MssageHandle:function(msgtype,parm)
    {
        var self = this;
        console.log("login msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
        switch(msgtype)
        {
            case 10230:
            {
                console.log("index:"+self.index);
                if(self.index == 2)
                {
                    
                    cc.vv.GlobalMsg.RemoveObserver(self);
                }
                

            }
            break;
            case 10231:
            {
                console.log("index:"+this.index);
                
            }
            break;
            default:
            break;
        }
    },

    SetMsg:function(msg)
    {
        try {
            console.log("LMssageHandle SetMsg msg:"+msg);
            this.msgitem.string = msg;
            this.node.setPosition(0,0);
            this.node.stopAllActions();;
            this.runupaction();
        } catch (error) {
            cc.error("msg show failed !");
        }
    },

    runupaction:function()
    {
        var self = this;

        var actionDone = cc.callFunc(function(target, score) {
            cc.vv.nodePoolMgr.delNode(self.node);
        }, this, 100);

        var seq = cc.sequence(cc.moveBy(self._actionTime, cc.p(0, 500)), actionDone);
        this.node.runAction(seq);
    },

});
