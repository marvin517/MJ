cc.Class({
    extends: cc.Component,

    properties: {
        state:-1,                    //节点状态，-1，未初始化，0，未使用，1，使用中
        index:0,
    },

    // use this for initialization
    // onLoad: function () {
    //     //cc.vv.GlobalMsg.RegisterWithTarget("GameMgrLMSG", this.MssageHandle,this);
    //     //this.state = -1;
    // },
    // MssageHandle:function(node,msgtype,parm)
    // {
    //     console.log("msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
    //     switch(msgtype)
    //     {
    //         case "NULL":
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
    //     //cc.vv.GlobalMsg.UnRegisterWithTarget("GameMgrLMSG", this.MssageHandle,this);
    // },
    init:function()
    {
        this.setState(0);
        console.log("BaseNode init");
    },
    reset:function()
    {
        this.setState(0);
        console.log("BaseNode reset");
    },
    setState:function(_state)
    {
        this.state = _state;
    },
    getState:function()
    {
        return this.state;
    },
});
