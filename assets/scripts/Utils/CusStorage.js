var CusStorage = cc.Class({
    extends: cc.Component,
    statics: {
        bUseDefault:true,               //是否使用默认存储方式

        
    },
    init:function()
    {
        this.bUseDefault = true;
    },

    SetUseDefault:function(use)
    {
        this.bUseDefault = use;
    },
    GetUseDefault:function(use)
    {
        return this.bUseDefault;
    },
    getItem:function(key)
    {
        cc.vv.global.Debuglog("CusStorage:getItem:"+key);
        if(this.bUseDefault)
        {
            cc.vv.global.Debuglog("CusStorage:getItem:"+key);
            return cc.sys.localStorage.getItem(key);
        }
        else
        {

        }
    },
    setItem:function(key,data)
    {
        if(this.bUseDefault)
        {
            cc.vv.global.Debuglog("CusStorage:setItem:"+key);
            cc.sys.localStorage.setItem(key,data);
        }
        else
        {

        }
    },
    
    removeItem:function(key)
    {
        if(this.bUseDefault)
        {
            cc.vv.global.Debuglog("CusStorage:removeItem:"+key);
            cc.sys.localStorage.removeItem(key);
        }
        else
        {

        }
    },
});
module.exports = new CusStorage();