var GLGameDefine = require("GLGameDefine");
cc.Class({
    extends: cc.Component,

    properties: {
        DDDSA: {
            default: [],
            type: [GLGameDefine.MessageType]
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
            case cc.vv.GLGameDefine.MessageType.createRoomSucess:
            {
                this.createRoomSucess(parm);
            }
            break;
            default:
            break;
        }
    },
    createRoomSucess:function(ret)
    {
        try {
            console.log("createRoomSucess:"+JSON.stringify(ret));
            //构建 获取房间信息 数据
            var data = {
                roomId: ret.data,
                userId: cc.vv.userMgr.userId
            };
            //获取房间信息
        } catch (error) {
            cc.vv.global.ShowErrorMsg("createRoomSucess Failed:"+JSON.stringify(error.message));
        }
        
        cc.vv.userMgr.getRoomInfo(data);
    },
    onDestroy:function()
    {
        cc.vv.GlobalMsg.RemoveObserver(this);
    },
});
