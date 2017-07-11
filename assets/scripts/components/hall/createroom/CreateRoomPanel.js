cc.Class({
    extends: cc.Component,

    properties: {
        _instanceCreateRoomPage:[],
        PrefCreateRoomPage:{
           default: [],
           type:cc.Prefab,
        },
    },

    // use this for initialization
    onLoad: function () {
        cc.vv.GlobalMsg.AddObserver(this);
    },

    MssageHandle:function(msgtype,parm)
    {
        var self = this;
        console.log("login msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.MessageType.RadioButtonClick:
            {

            }
            break;
            
            default:
            break;
        }
    },
    showPage:function (TabIndex) {
        if (TabIndex < 0) {
            return;
        }
        console.log("onClickTabBtn :" + TabIndex);
        var prefab = null;
        var instance = null;
        prefab = this.PrefCreateRoomPage[TabIndex];
        instance = this._instanceCreateRoomPage[TabIndex];

        if (instance == null) {
            instance = cc.instantiate(prefab);
            this._contentNode.addChild(instance);
            this._instanceCreateRoomPage[TabIndex] = instance;
        }
        
        for(var createrule in this._instanceCreateRoomPage){
            if(this._instanceCreateRoomPage[createrule] == instance){
                this._instanceCreateRoomPage[createrule].active = true;
            }
            else{
                this._instanceCreateRoomPage[createrule].active = false;
            }
        }
        
    },
    onDestroy:function()
    {
        cc.vv.GlobalMsg.RemoveObserver(this);
    },
});
