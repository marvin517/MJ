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
        index:1,
    },

    // use this for initialization
    onLoad: function () {
        cc.log("corNode onLoad");
        cc.vv.PoolMgr.init();
    },
    start:function()
    {
        
        cc.log("corNode start");
    },
    test:function()
    {
        this.index = this.index +1;
        for(var i=0;i<6;i++)
        {
            var _node = cc.vv.PoolMgr.GetPrefab("TestPoolNode");
            
            if(_node != null)
            {
                cc.log("this.addChild(node) is not null");
                this.node.addChild(_node);
                _node.setPosition(100*this.index+i*100, i*60)
            }
            else
            {
                cc.log("this.addChild(node) is null");
            }
        }
    },
});
