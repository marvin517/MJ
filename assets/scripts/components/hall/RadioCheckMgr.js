
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
        _children:null,
        MutilChcek:false,
        toggle: {
            default:[],
            type:[cc.Toggle]
        }
    },

    // use this for initialization
    onLoad: function () {
        try {
            this.init();

            for(var i = 0;i < this.toggle.length;i++)
            {
                this.toggle[i].node.on('toggle', this.callback, this);
            }
        } catch (error) {
            cc.error("RadioCheckMgr onLoad failed :"+JSON.stringify(error.message));
        }
        
        
    },
    init:function()
    {
        cc.vv.GlobalMsg.AddObserver(this);
    },
    OnRadioBTClick:function(event,customdata)
    {
        console.log("event:"+JSON.stringify(event.data));
        console.log("event:"+JSON.stringify(event.target.name));
        console.log("customdata:"+JSON.stringify(customdata));
    },



    callback: function (event) {
       //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Toggle 组件
       var toggle = event.detail;
       console.log("toggle:"+toggle);
       for (var index = 0; index < this.toggle.length; index++) {
           if(toggle == this.toggle[index])
           {
               console.log("toggle index:"+index);
           }
           else
           {
                console.log("toggle other index:"+index);
           }
       }
       //do whatever you want with toggle
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

    onDestroy:function()
    {
        cc.vv.GlobalMsg.RemoveObserver(this);
    },
});
