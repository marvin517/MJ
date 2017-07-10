var Utils = cc.Class({
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
    },

    addClickEvent:function(node,target,component,handler){
        console.log(component + ":" + handler);
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },
    
    addSlideEvent:function(node,target,component,handler){
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var slideEvents = node.getComponent(cc.Slider).slideEvents;
        slideEvents.push(eventHandler);
    },

    //////九日，小工具集

    ////判空函数
    alert:function(obj,objName)
    {
        if (typeof (obj) == "null" || typeof (obj) == "undefined" || obj == null || obj == undefined)
        {
                cc.error("AlertForNull: " + objName + " is Unavailable");
                return false;
        }
        return true;
    },
    alertObj:function(obj,msg)
    {
        if (typeof (obj) == "null" || typeof (obj) == "undefined" || obj == null || obj == undefined)
        {
                cc.error("AlertForNull: " + obj + " is Unavailable:"+JSON.stringify(msg));
                return null;
        }
        return obj;
    },
    ////判空函数
    alert_InDetail:function(obj,objName)
    {
        if(typeof(obj) === "null"){
            console.log("AlertForNull: " + objName + " is null");
            return 1;
        }
        else if(typeof(obj) === "undefined"){
            console.log("AlertForNull: " + objName + " is undefined");
            return 2;
        }
        else if(typeof(obj)){

        }
        else if(isNaN(obj)){
            console.log("AlertForNull: " + objName + " is NaN");
            return 3;
        }
        ////return 0 表示数据非空，是正常的。返回其他值则根据具体返回值判断
        return 0;
    },

    ////设置指定节点的Label的值
    setLabel:function(obj,value){
        var label = obj.getComponent(cc.Label);
        label.string = value;
    },

    ////富文本
    setRichText: function (obj, value) {
        var label = obj.getComponent(cc.RichText);
        label.string = value;
    },

    // ////有问题，后面改
    getChildByName:function(node,childName){
        var MyNode = node;

        if(MyNode.name == childName){
            return MyNode;
        }
        var Children = MyNode.children;
        if(Children.length == 0)
        {
            return null;
        }
        for(var i = 0; i < Children.length;i++){
            if(Children[i].name == childName){
                console.log("find!!" + Children[i]);
                return Children[i];      
            }
            cc.vv.utils.getChildByName(Children[i],childName);
        }
    },


    getChildByPath: function (node, path) {
        ///判空处理
        cc.vv.utils.alert(node, "node");
        var pathStr = path;
        ////将路径字符串切割成字符串数组 
        var strArr = [];
        strArr = pathStr.split("/");
        var MyNode = node;
        ////循环逐层拿到子节点
        for (var i = 0; i < strArr.length; i++) {
            console.log("getChild3: " + strArr[i]);
            MyNode = MyNode.getChildByName(strArr[i]);
        }
        cc.vv.utils.alert(MyNode, "MyNode");
        return MyNode;
    },
    
    ////截取指定长度的字符串
    cutString: function (objString, num) {

        //return objString.substring(0,num);
 
        if (objString.length < num) {
            return objString;
        }
        var s = "";
        var sLength = 0;
        for (var i = 0; i < objString.length; i++) {
            s = s + objString.charAt(i);

            if (objString.charCodeAt(i) > 128) {
                sLength += 2;
            }
            else {
                sLength += 1;
            }
            if (sLength >= num) {
                return s.substring(0, s.length);
            }
        }
        return s;
    },
    
    loadResCus:function(path,fun)
    {
        cc.loader.loadRes(path,fun); 
    },
    /////加载预制,返回预制实例化的节点
    loadPrefab: function (path) {

        if (cc.vv.utils.alert(path, "path") || path == "")
            return null;
        cc.loader.loadRes(path, function (err, pre) {
            console.log(" 加载分享预制体回调  Loading Share_choose Layer");
            // 如果出错
            if (err === "") {
                console.log(" Loading prefab Failed : " + err);
                return null;
            }
            // 没有出错
            else {
                console.log(" Loading prefab Success : ");
                // 创建实例
                var node = cc.instantiate(pre);
                return node;
            }
        });
    },
    /////动态设置设置精灵纹理,传入精灵节点和纹理路径
    setSpriteFream: function (node, path) {
        if (cc.vv.utils.alert(node, "node") || cc.vv.utils.alert(path, "path") || path == "") {
            return null;
        }
        var spr = node.spriteFrame
        cc.loader.loadRes(path, cc.SpriteFrame, function (err, spriteFrame) {
            if (err === "") {
                console.log("loadSpriteFream failed");
            }
            else {
                console.log("loadSpriteFream success");
                spr = spriteFrame;
                return true;
            }
        });
    }



});
module.exports = new Utils();