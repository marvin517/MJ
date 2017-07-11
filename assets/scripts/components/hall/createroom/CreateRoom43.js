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
        AANode:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.GlobalMsg.AddObserver(this);
    },
    MssageHandle:function(msgtype,parm)
    {
        var self = this;
        console.log("CreateRoom43 msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.MessageType.CheckType_jushu:
            {
                if(parm != null && parm != undefined && parm[1] != undefined)
                {
                    if(parm[1] == true)
                    {
                        this.AANode.active = true;
                    }
                    else
                    {
                        this.AANode.active = false;
                    }
                    console.log("this.jushuxuanze:"+this.jushuxuanze);
                }
                
            }
            break;
            default:
            break;
        }
    },
    onDestroy:function()
    {
        cc.vv.GlobalMsg.RemoveObserver(this);
    },
});
