cc.Class({
    extends: cc.Component,

    properties: {

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
            case 10230:
            {
               
            }
            break;
            case 10231:
            {

            }
            break;
            default:
            break;
        }
    },
});
