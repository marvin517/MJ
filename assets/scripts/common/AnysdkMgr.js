var AnysdkMgr = cc.Class({
    extends: cc.Component,

    properties: 
    {
        _isCapturing:false,
        _orderid:"",
    },
    // use this for initialization
    onLoad: function () {
    },

    init:function(){
        this.ANDROID_API = "com/zcyx/dzmj/WXAPI";
        this.IOS_API = "AppController";
    },
    //请求登陆
    login: function () 
    {
        if (cc.sys.os == cc.sys.OS_ANDROID) 
        {
            //this.getDistance("30.1","104.3","30.2","104.2");
            jsb.reflection.callStaticMethod(this.ANDROID_API, "requestLogin", "(Ljava/lang/String;)V", "js call requestLogin!!!!!");
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(this.IOS_API, "login");
        }
        else {
            console.log("platform:" + cc.sys.os + " dosn't implement login.");
        }
    },
    clientNetchange:function(state)
    {
        console.log("clientNetchange state:" + state);
        if(state == 0)
        {

        }
        else if(state == 1)
        {

        }
        else if(state == 2)
        {

        }
    },
    //从IOS官方渠道付费
    BuyProductFromIOS:function(payinfo)
    {
    	if(cc.sys.os == cc.sys.OS_IOS)
        {
            
            jsb.reflection.callStaticMethod(this.IOS_API, "BuyProductFromIOS:",JSON.stringify(payinfo));
        }
        else
        {
            console.log("platform:" + cc.sys.os + " dosn't implement BuyProductFromIOS.");
        }
    },

    buyFailed:function(date)
    {
        console.log("-----------------buyFailed------");
        cc.vv.PomeloNetMgr.RequestWithParams("charge.chargeHandler.confirmPendingOrder",{"ourOrder":this._orderid,"result":"failed"},function(data)
        {
            console.log("data:"+JSON.stringify(data));
        });

    },
    //官方支付成功
    buyIOSSucess:function(date)
    {
        console.log("-----------------buySYBSucess------date:"+JSON.stringify(date));
        
        var goods = cc.vv.global.GetGoodsByID(cc.vv.global.BuyID);
        cc.vv.global.Debuglog("Debuglog:cc.vv.global.BuyID:"+cc.vv.global.BuyID);
        cc.vv.global.Debuglog("Debuglog:goods.itemId:"+goods.itemId);
        cc.vv.global.Debuglog("Debuglog:goods.number:"+goods.number);
        cc.vv.PomeloNetMgr.RequestWithParams("charge.chargeHandler.givePlayerItem",{"itemId": goods.itemId,"number":goods.number},function(data)
        {
            console.log("IOS付费成功，向自己服务器发送验证信息，并收取回调");
            console.log("data:"+JSON.stringify(data));

            cc.vv.userMgr.gems = data.data;
            cc.vv.GlobalMsg.Send("buySucess");
            cc.vv.GlobalMsg.Send("shopbuySucess");
        });
        // cc.vv.http.sendRequest("charge.chargeHandler.givePlayerItem",{"itemId": goods.itemId,"number":goods.number},function(data)
        // {
        //     console.log("IOS付费成功，向自己服务器发送验证信息，并收取回调");
        //     console.log("data:"+JSON.stringify(data));

        //     cc.vv.userMgr.gems = data.data;
        //     cc.vv.GlobalMsg.Send("buySucess");
        //     cc.vv.GlobalMsg.Send("shopbuySucess");
        // });
    },
    // 分享文本
    ShareMessage: function (where, title, desc) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "ShareMessage", "(ILjava/lang/String;Ljava/lang/String;)Z", where, title, desc);
        }
        else if (cc.sys.os == cc.sys.OS_IOS) 
        {
            // 未完成
            // jsb.reflection.callStaticMethod(this.IOS_API, "share:shareTitle:shareDesc:", cc.vv.SI.appweb, title, desc);
        }
        else {
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    },
    // 分享下载链接 --> 0 ：分享给朋友或群，  1：分享到朋友圈
    shareURl: function (where, title, desc) {
       var shareurl = cc.vv.global.ShareURL_Android;

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            shareurl = cc.vv.global.ShareURL_Android;
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            shareurl = cc.vv.global.ShareURL_IOS;
        }
        shareurl += "?";

        //inviteRoomId is not  null
        if (cc.vv.global.inviteRoomId != null && cc.vv.global.inviteRoomId.length == 6) {
            shareurl += ("roomID=" + cc.vv.global.inviteRoomId);
        }
        else{
            shareurl += ("roomID=null");
        }
        cc.vv.global.inviteRoomId = "";
        // cc.vv.global.Debuglog("shareURl inviteID : "+ cc.vv.global.inviteID + " length " + cc.vv.global.inviteID.length);
        if (cc.vv.global.inviteID != null && cc.vv.global.inviteID.length == 6) {
            shareurl = shareurl + "&inviteID=" + cc.vv.global.inviteID;
        }
        else{
            shareurl += ("&inviteID=null");
        }
        cc.vv.global.inviteID = "";

        if (cc.vv.global.teahouseID != null && cc.vv.global.teahouseID.length == 6) {
            shareurl = shareurl + "&teahouseID=" + cc.vv.global.teahouseID;
        }
        else{
            shareurl += ("&teahouseID=null");
        }
        cc.vv.global.teahouseID = "";

        cc.vv.global.Debuglog("shareURl : "+ shareurl);
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "ShareUrl", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Z",where, shareurl, title, desc);
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("ThirdPartyIOS", "ShareURL_Type:ShareURL:Title:Description:", where, shareurl, title, desc);
        }
        // else {
        //     console.log("platform:" + cc.sys.os + " dosn't implement share.");
        // }
    },
    // 分享下载链接 --> 0 ：分享给朋友或群，  1：分享到朋友圈
    shareURl_DaTing: function (where, title, desc) {
        cc.log(" 分享 ：title："+title +"  desc:"+desc);
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "ShareUrl", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Z",where, cc.vv.global.ShareURL_Android, title, desc);
        }
        else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod("ThirdPartyIOS", "ShareURL_Type:ShareURL:Title:Description:", where, cc.vv.global.ShareURL_IOS, title, desc);
        }
        // else {
        //     console.log("platform:" + cc.sys.os + " dosn't implement share.");
        // }
    },
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //链接启动app
    StartWithRoomID:function(data)
    {
        cc.vv.global.Debuglog("anysdk StartWithRoomID.data = "+data);

        var fn = function(){
            if (data != null && data != "" && data.length == 6 && data != "(null)") {
                cc.vv.global.autoEnterRoom = data;
                cc.vv.userMgr.enterRoom(cc.vv.global.autoEnterRoom);
                //使用后置空
                cc.vv.global.autoEnterRoom = null;
            }
        }
        setTimeout(fn, 50);
    },
    //链接启动茶馆并发送加入茶馆请求
    StartWithTeaHouseId:function(data)
    {
        cc.vv.global.Debuglog("anysdk StartWithTeaHouseId.data = "+data);

        var fn = function(){
            if (data != null && data != "" && data.length > 5 && data != "(null)") {
                cc.vv.global.teahouseID = data;
                if(cc.director.getScene().name == "hall"){
                    //cc.director.getScene().getChildByName('Canvas').getComponent("Hall").requestTeaHouse(false, cc.vv.global.teahouseID);
                    cc.vv.GlobalMsg.Send("GameMgrMSG",cc.vv.GLGameDefine.MessageType.hall_autoJoinTeahouse,cc.vv.global.teahouseID);
                }

                //使用后置空
                cc.vv.global.teahouseID = null;
            }
        }
        setTimeout(fn, 50);
    },
    SetMWInfo:function(roomID,inviteID,teahouseID)
    {
        cc.vv.global.Debuglog("anysdk SetMWInfo.roomID ="+roomID+",inviteID="+inviteID+",teahouseID="+teahouseID);
        //一次只能走一个魔窗位
        if(roomID != null && roomID != "" && roomID.length == 6 && roomID != "(null)")
        {
            this.StartWithRoomID(roomID);
        }
        else if(inviteID != null && inviteID != "" && inviteID.length > 5 && inviteID != "(null)")
        {
            //跳转邀请界面，填写邀请码
            cc.vv.global.Debuglog("SetMWInfo 132 inviteID : " + inviteID);
            var fn = function () {
                cc.find("Canvas/inviteCode").active = true;
                cc.vv.global.Debuglog("SetMWInfo 234 inviteID : " + inviteID);
                cc.find("Canvas/inviteCode").getComponent("inviteCode").setInviteCode(inviteID);
            }
            setTimeout(fn, 50);
        }
        else if(teahouseID != null && teahouseID != "" && teahouseID.length > 5 && teahouseID != "(null)")
        {
            //自动跳转茶馆界面，填写茶馆ID
            this.StartWithTeaHouseId(teahouseID);
        }
    },
    GetRoomID:function()
    {
        cc.vv.global.Debuglog("anysdk GetRoomID");
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "JSGetRoomID", "(Ljava/lang/String;)V", "");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "JSGetRoomID");
        }
        else{
            this.StartWithRoomID(null);
        }
        
    },
    ClearRoomID:function()
    {
        cc.vv.global.Debuglog("anysdk JSClearRoomID");
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "JSClearRoomID", "(Ljava/lang/String;)V", "");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "JSClearRoomID");
        }
        else{
            this.StartWithRoomID(null);
        }
        
    },
    autoEnterRoomFun: function () 
    {
        cc.vv.global.Debuglog("Debuglog:autoEnterRoomFun begin,name="+cc.director.getScene().name);
        //&& cc.vv.gameNetMgr != null && cc.vv.gameNetMgr.roomId == null
        if(cc.director.getScene().name == "hall")
        {
            if(cc.vv.gameNetMgr != null && cc.vv.gameNetMgr.roomId == null)
            {
                cc.vv.anysdkMgr.GetRoomID();
            }
            //进入大厅，放间号不为空
            if(cc.vv.gameNetMgr != null && (cc.vv.gameNetMgr.roomId != null || cc.vv.gameNetMgr.roomId== "undefined"))
            {
                cc.vv.anysdkMgr.ClearRoomID();
            }
        }else
        {
            //在游戏场景中，需要清理，在hall中，但是是返回大厅的，需要清理
            if(cc.director.getScene().name == "mjgame" || cc.director.getScene().name == "mjgame3D")
            {
                cc.vv.anysdkMgr.ClearRoomID();
            }
        }
    },
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 分享图片 --> 0 ：分享给朋友或群，  1：分享到朋友圈
    ShareForImage:function(where, title, desc)
    {
        if(this._isCapturing){
            return;
        }
        this._isCapturing = true;
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        // 得到完整路径
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        console.log("fullPath:"+fullPath);
        if (fullPath.length == 0) {
            console.log("getfile path failed!");
            return;
        }
        // 判断文件是否存在
        if (jsb.fileUtils.isFileExist(fullPath)) {
            jsb.fileUtils.removeFile(fullPath);
        }
        this.ScreenShot(fileName);

        var self = this;
        var tryTimes = 0;
        var fn = function () 
        {
                if (cc.sys.os == cc.sys.OS_ANDROID) 
                {
                    jsb.reflection.callStaticMethod(self.ANDROID_API, "ShareImage", "(ILjava/lang/String;Ljava/lang/String;Ljava/lang/String;)Z", where, fullPath, title, desc);
                }
                else if (cc.sys.os == cc.sys.OS_IOS) 
                {
                    jsb.reflection.callStaticMethod("ThirdPartyIOS", "ShareImage:FilePath:Title:Description:", where, fullPath, title, desc);
                }


                self._isCapturing = false;
        }
        setTimeout(fn,50);
    },


    //
    shareResult:function(){
        if(this._isCapturing){
            return;
        }
        this._isCapturing = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            jsb.fileUtils.removeFile(fullPath);
        }
        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height));
        texture.setPosition(cc.p(size.width/2, size.height/2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);
        
        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
			    var width = Math.floor(size.width * scale);
                
                if(cc.sys.os == cc.sys.OS_ANDROID){
                    jsb.reflection.callStaticMethod(self.ANDROID_API, "ShareIMG", "(Ljava/lang/String;II)V",fullPath,width,height);
                }
                else if(cc.sys.os == cc.sys.OS_IOS){
                    jsb.reflection.callStaticMethod(self.IOS_API, "shareIMG:width:height:",fullPath,width,height);
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement share.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50); 
            }
        }
        setTimeout(fn,50);
    },
    
    //微信登陆回调
    onLoginResp:function(code){
        var fn = function () {
            //fm
            var data = {
                sign: 2,
                os: cc.sys.os,
                account: code,
                password: null
            };

            cc.vv.userMgr.login(data);
        }
        setTimeout(fn, 100);
    },
    //user cancel
    onLoginRespCancel:function(){
        var fn = function(){
            cc.vv.wc.hide();
        }
        setTimeout(fn, 100);
    },
    //屏幕截图
    ScreenShot: function (fileName) {
        if(CC_JSB) {
        //如果待截图的场景中含有 mask，请开启下面注释的语句
        var renderTexture = cc.RenderTexture.create(1280,720, cc.Texture2D.PIXEL_FORMAT_RGB565, gl.DEPTH24_STENCIL8_OES);
        // var renderTexture = cc.RenderTexture.create(1280, 640);
        //把 renderTexture 添加到场景中去，否则截屏的时候，场景中的元素会移动
        cc.director.getScene().getChildByName('Canvas').parent._sgNode.addChild(renderTexture);
        //把 renderTexture 设置为不可见，可以避免截图成功后，移除 renderTexture 造成的闪烁
        renderTexture.setVisible(false);

        //实际截屏的代码
        renderTexture.begin();
        //this.richText.node 是我们要截图的节点，如果要截整个屏幕，可以把 this.richText 换成 Canvas 切点即可
        cc.director.getScene().getChildByName('Canvas')._sgNode.visit();
        renderTexture.end();
        renderTexture.saveToFile(fileName, cc.IMAGE_FORMAT_PNG, true, function () {
            //把 renderTexture 从场景中移除
            renderTexture.removeFromParent();
            cc.log("capture screen successfully!");
        });
        //打印截图路径
        cc.log(jsb.fileUtils.getWritablePath() + fileName);
        }
    },
    /////向java代码请求定位数据/////getlocationjs
    getLocateFromJava:function()
     {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod(this.ANDROID_API, "getlocationjs" ,"(Ljava/lang/String;)V", "");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "getlocationjs");
        }

     },
    //////收到定位数据回调
    setlocation:function(m_Latitude,m_Longitude)
    {
        // console.log("AnysdkMgr:setlocation!!")
        // console.log(typeof m_Latitude);
        // console.log(typeof m_Longitude);
        // console.log("m_Latitude:" + m_Latitude);
        // console.log("m_Longitude" + m_Longitude);
        // console.log("m_Latitude" + JSON.stringify(m_Latitude));
        // console.log("m_Longitude" + JSON.stringify(m_Longitude));

        // var Latitude = parseFloat(m_Latitude);
        // var Longitude = parseFloat(m_Longitude);
        
        
        // var str = m_Latitude; 
        // var arr =str.split(",");
        // var m_Latitude1 = arr[0];
        // var m_Longitude = arr[1];

        cc.sys.localStorage.setItem("myLatitude",m_Latitude);
        cc.sys.localStorage.setItem("myLongitude",m_Longitude);
    },
    // ////调用java获取距离
    getDistance:function(mLat1,mLon1,mLat2,mLon2)
    {
        if (cc.sys.os == cc.sys.OS_ANDROID) 
        {
            //cc.vv.global.Debuglog("anysdk getDistance mLat1:"+mLat1+",mLon1:"+mLon1);
            jsb.reflection.callStaticMethod(this.ANDROID_API, "getDistance" ,"(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",mLat1,mLon1,mLat2,mLon2);
        }
    },
    setDistance:function(dis)
    {
        cc.vv.global.Debuglog("anysdk getDistance dis:"+dis);
    },
    //主动重连
    activeToReconnection:function(){
        cc.vv.allRequest.activeToReconnection();
    },
});
module.exports = new AnysdkMgr();