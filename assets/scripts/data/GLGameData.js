//本地游戏所数据
//路由---保证不同游戏在同一个对象中，确保不会重复
//本地消息-----全局唯一，保持在同一个对象中
var GLGameData = cc.Class({
    extends: cc.Component,
    statics: {
        seats:[],
        //本地数据，拥有一个user对象
        //商品数据类
        
        init:function()
        {
            
        },

    }
});