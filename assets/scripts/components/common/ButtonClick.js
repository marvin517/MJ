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
    },

    // use this for initialization
    onLoad: function () {
        // this.init();
    }, 
    // init:function()
    // {
    //     cc.vv.GlobalMsg.RegisterWithTarget("GameMgrLMSG", this.LMssageHandle,this);
    // },
    //监听本地消息，并处理
    // LMssageHandle:function(_node,msgtype,parm)
    // {
    //     console.log("msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
    //     switch(msgtype)
    //     {
    //         case "":
    //         {
    //             console.log("parm:",parm);
    //         }
    //         break;
    //         default:
    //         break;
    //     }
    // },
    // onDestroy:function()
    // {
    //     cc.vv.GlobalMsg.UnregisterWithTarget("GameMgrLMSG", this.LMssageHandle,this);
    // },

    OnButtonClickName:function(event)
    {
        console.log("event.target.name:"+JSON.stringify(event.target.name));
        cc.vv.GlobalMsg.SendWithTarget("GameMgrLMSG",cc.vv.GLGameDefine.MessageType.ButtonClick,event.target.name);
        cc.vv.GlobalMsg.SendMsg(cc.vv.GLGameDefine.MessageType.ButtonClick,event.target.name);
    },
    OnButtonClickCusData:function(event,customEventData)
    {
        console.log("event.target.kind:"+JSON.stringify(customEventData));
        console.log("event.target.ButtonClick:"+cc.vv.GLGameDefine.MessageType.ButtonClick);
        cc.vv.GlobalMsg.SendWithTarget("GameMgrLMSG",cc.vv.GLGameDefine.MessageType.ButtonClick,customEventData);
        cc.vv.GlobalMsg.SendMsg(cc.vv.GLGameDefine.MessageType.ButtonClick,customEventData);
    },
    OnButtonClickCusDataGL:function(event,customEventData)
    {
        console.log("event.target.kind:"+JSON.stringify(customEventData));
        cc.vv.GlobalMsg.Send("GameMgrMSG",cc.vv.GLGameDefine.MessageType.ButtonClick,customEventData);
        cc.vv.GlobalMsg.SendMsg(cc.vv.GLGameDefine.MessageType.ButtonClick,customEventData);
    }
});
