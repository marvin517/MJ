var GLGameDefine = require("GLGameDefine");
cc.Class({
    extends: cc.Component,

    properties: {
        toggle: {
            default:null,
            type:cc.Toggle
        },
        checktype: {
            default: GLGameDefine.MessageType.CheckType_jushu,
            type: GLGameDefine.MessageType
        },
    },
    // use this for initialization
    onLoad: function () {
        try {
            this.toggle.node.on('toggle', this.callback, this);
        } catch (error) {
            cc.error("RadioCheckMgr onLoad failed :"+JSON.stringify(error.message));
        }
    },

    callback: function (event) {
        try {
            //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Toggle 组件
            var toggle = event.detail;
            console.log("toggle:"+toggle.name);
            console.log("toggle:"+toggle.isChecked);
            var chooselist=[];
            chooselist.push(toggle.isChecked);
            console.log("toggle chooselist:"+JSON.stringify(chooselist));
            cc.vv.GlobalMsg.SendMsg(this.checktype,chooselist);
        } catch (error) {
            cc.error("callback failed");
        }
    },
});
