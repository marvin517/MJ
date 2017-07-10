var BaseNode = require("BaseNode");
cc.Class({
    extends: BaseNode,

    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        //this.prototype.onLoad();
        
    },
    
    init:function()
    {
        console.log("BaseNode testnode init");
        this.__proto__.init();
        //this._super();
    },
    reset:function()
    {
        this.__proto__.reset();
        //this._super();
        console.log("BaseNode testnode reset");
    },
});
