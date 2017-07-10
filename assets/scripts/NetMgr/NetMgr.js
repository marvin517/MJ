var NetMgr = cc.Class({
    extends: cc.Component,

    properties: {
    },

    init:function()
    {
        this.initLocalListener();
        this.initHandlers();
    },
    initLocalListener:function()
    {
    },
    //游戏数据请求，数据回调根据路由转发
    //后面根据路由做指定操作
    NetRequest:function(rout,data,Isshow)
    {
        var successFun = function (ret)
        {
            //cc.vv.wc.hide();
            //等所有回来的数据格式统一，采用200,500标记成功与否
            cc.vv.GlobalMsg.Send("GameMgrMSG_Req_Cb",rout,ret);
        }
        var failFun = function()
        {
            //cc.vv.wc.hide();
            console.log("rout:"+rout+" failed");
            cc.vv.GlobalMsg.Send("GameMgrMSG_Req_Cb_failed",rout,null);
        }
        if(Isshow == true)
        {
            //cc.vv.wc.show("");
        }
        
        cc.vv.allRequest.thirdRequest(rout, data, successFun, failFun);
    },
    //游戏数据发送，不需要回调
    NetSend:function(rout,data)
    {
        //cc.vv.net.send(rout,data);
    },
    //监听服务器消息
    //根据回来的数据，判断成功与否之后，发送指定消息
    //优化建议：使用数组或者列表，保存key，然后注册监听
    initHandlers:function()
    {
        console.log("netmgr initHandlers ----------------");
        var self = this;
        //public---------------------------public---------------------------public----------------------------------------------------------begin
        //用户准备
        // cc.vv.allRequest.addHandler("user_ready_push",function(data)
        // {
        //     console.log("user_ready_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.user_ready_push,data);
        // });
        // //用户进入
        // cc.vv.allRequest.addHandler("onUserEnter",function(data)
        // {
        //     console.log("onUserEnter:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.userEnter,data);
        // });
        // //用户退出
        // cc.vv.allRequest.addHandler("onUserLeave",function(data)
        // {
        //     console.log("onUserLeave:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.userLeave,data);
        // });
        // //用户上下线
        // cc.vv.allRequest.addHandler("onUserOffline",function(data)
        // {
        //     console.log("onUserOffline:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.userOnOffLine,data);
        // });
        // //房主解散
        // cc.vv.allRequest.addHandler("onHouseownerDissolve",function(data)
        // {
        //     console.log("onHouseownerDissolve:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.onHouseownerDissolve,data);
        // });
        // //游戏开始
        // cc.vv.allRequest.addHandler("game_begin_push",function(data)
        // {
        //     console.log("game_begin_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_begin_push,data);
        // });
        // //游戏第几局
        // cc.vv.allRequest.addHandler("game_num_push",function(data)
        // {
        //     console.log("game_num_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_num_push,data);
        // });
        // //手牌
        // cc.vv.allRequest.addHandler("game_holds_push",function(data)
        // {
        //     console.log("game_holds_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_holds_push,data);
        // });
        // //通知玩家房间解散信息改变
        // cc.vv.allRequest.addHandler("dissolve_notice_push",function(data)
        // {
        //     console.log("dissolve_notice_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.dissolve_notice_push,data);
        // });
        // //通知玩家房间解散被取消
        // cc.vv.allRequest.addHandler("dissolve_cancel_push",function(data)
        // {
        //     console.log("dissolve_cancel_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.dissolve_cancel_push,data);
        // });
        // //通知玩家房间解散成功-用于客户端刷新界面
        // cc.vv.allRequest.addHandler("dissolve_success_push",function(data)
        // {
        //     console.log("dissolve_success_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.dissolve_success_push,data);
        // });

        // //public---------------------------public---------------------------public----------------------------------------------------------end

        // //lzmj-----------------------------lzmj-----------------------------lzmj------------------------------------------------------------begin
        // //用户托管状态推送
        // cc.vv.allRequest.addHandler("user_trusteeship_push",function(data)
        // {
        //     console.log("user_trusteeship_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.user_trusteeship_push,data);
        // });
        // //游戏运行
        // cc.vv.allRequest.addHandler("game_playing_push",function(data)
        // {
        //     console.log("game_playing_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_playing_push,data);
        // });
        // //定缺
        // cc.vv.allRequest.addHandler("game_dingque_push",function(data)
        // {
        //     console.log("game_dingque_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_dingque_push,data);
        // });
        // //换牌
        // cc.vv.allRequest.addHandler("game_huanpai_push",function(data)
        // {
        //     console.log("game_huanpai_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_huanpai_push,data);
        // });
        // //换杠
        // cc.vv.allRequest.addHandler("hangang_notify_push",function(data)
        // {
        //     console.log("hangang_notify_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.hangang_notify_push,data);
        // });
        // //动作推送
        // cc.vv.allRequest.addHandler("game_action_push",function(data)
        // {
        //     console.log("game_action_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_action_push,data);
        // });
        // //出牌
        // cc.vv.allRequest.addHandler("game_chupai_push",function(data)
        // {
        //     console.log("game_chupai_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_chupai_push,data);
        // });
        // //麻将数量
        // cc.vv.allRequest.addHandler("mj_count_push",function(data)
        // {
        //     console.log("mj_count_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.mj_count_push,data);
        // });
        // //胡牌
        // cc.vv.allRequest.addHandler("hu_push",function(data)
        // {
        //     console.log("hu_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.hu_push,data);
        // });
        // //
        // cc.vv.allRequest.addHandler("game_chupai_notify_push",function(data)
        // {
        //     console.log("game_chupai_notify_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_chupai_notify_push,data);
        // });
        // //摸牌
        // cc.vv.allRequest.addHandler("game_mopai_push",function(data)
        // {
        //     console.log("game_mopai_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_mopai_push,data);
        // });
        // //
        // cc.vv.allRequest.addHandler("specially_tidy_holds_push",function(data)
        // {
        //     console.log("specially_tidy_holds_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.specially_tidy_holds_push,data);
        // });
        // //过通知
        // cc.vv.allRequest.addHandler("guo_notify_push",function(data)
        // {
        //     console.log("guo_notify_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.guo_notify_push,data);
        // });
        // //
        // cc.vv.allRequest.addHandler("guo_result",function(data)
        // {
        //     console.log("guo_result:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.guo_result,data);
        // });
        // //过胡
        // cc.vv.allRequest.addHandler("guohu_push",function(data)
        // {
        //     console.log("guohu_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.guohu_push,data);
        // });
        // //换牌通知
        // cc.vv.allRequest.addHandler("huanpai_notify",function(data)
        // {
        //     console.log("huanpai_notify:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.huanpai_notify,data);
        // });
        // //换牌结束
        // cc.vv.allRequest.addHandler("game_huanpai_over_push",function(data)
        // {
        //     console.log("game_huanpai_over_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_huanpai_over_push,data);
        // });
        // //碰
        // cc.vv.allRequest.addHandler("peng_notify_push",function(data)
        // {
        //     console.log("peng_notify_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.peng_notify_push,data);
        // });
        // //杠
        // cc.vv.allRequest.addHandler("gang_notify_push",function(data)
        // {
        //     console.log("gang_notify_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.gang_notify_push,data);
        // });
        // //定缺改变
        // cc.vv.allRequest.addHandler("game_dingque_notify_push",function(data)
        // {
        //     console.log("game_dingque_notify_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_dingque_notify_push,data);
        // });
        // //定缺结束
        // cc.vv.allRequest.addHandler("game_dingque_finish_push",function(data)
        // {
        //     console.log("game_dingque_finish_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_dingque_finish_push,data);
        // });
        // //语音、短语、自定义文本、表情都在此处监听
        // cc.vv.allRequest.addHandler("voice_msg_push",function(data)
        // {
        //     console.log("voice_msg_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.voice_msg_push,data);
        // });
        // //自定义文本聊天
        // cc.vv.allRequest.addHandler("voice_msg_pushs",function(data)
        // {
        //     console.log("voice_msg_pushs:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.voice_msg_pushs,data);
        // });
        // //短语
        // cc.vv.allRequest.addHandler("quick_chat_push",function(data)
        // {
        //     console.log("quick_chat_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.quick_chat_push,data);
        // });
        // //表情
        // cc.vv.allRequest.addHandler("emoji_push",function(data)
        // {
        //     console.log("emoji_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.emoji_push,data);
        // });
        // //开局动画
        // cc.vv.allRequest.addHandler("specially_game_start_push",function(data)
        // {
        //     console.log("specially_game_start_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.specially_game_start_push,data);
        // });
        // //物品发放
        // cc.vv.allRequest.addHandler("onPurchasedItem",function(data)
        // {
        //     console.log("onPurchasedItem:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.onPurchasedItem,data);
        // });
        // //
        // cc.vv.allRequest.addHandler("game_start_perCardLeftNum_push",function(data)
        // {
        //     console.log("game_start_perCardLeftNum_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_start_perCardLeftNum_push,data);
        // });
        // //
        // cc.vv.allRequest.addHandler("Start_Time_Push",function(data)
        // {
        //     console.log("Start_Time_Push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.Start_Time_Push,data);
        // });
        // //游戏结束
        // cc.vv.allRequest.addHandler("game_over_push",function(data)
        // {
        //     console.log("game_over_push:"+JSON.stringify(data));
        //     cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.game_over_push,data);
        // });

        //lzmj-----------------------------lzmj-----------------------------lzmj------------------------------------------------------------end

       
        //lznn-----------------------------lznn-----------------------------lznn------------------------------------------------------------end

        //teahouse-----------------------------teahouse-----------------------------teahouse------------------------------------------------------------begin
        //散户加入茶馆里需要客户端发起填邀请码请求
        cc.vv.allRequest.addHandler("fillSpreaderCodeInTH_push",function(data)
        {
            console.log("fillSpreaderCodeInTH_push:"+JSON.stringify(data));
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_fill_spreadercode_push,data);
        });
        //茶馆列表
        cc.vv.allRequest.addHandler("teaHouseList_push",function(data)
        {
            console.log('teaHouseList_push:' + JSON.stringify(data));
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_list_push,data);
        });
        //茶馆中玩家权限更新
        cc.vv.allRequest.addHandler("update_userTitle_push",function(data)
        {
            console.log("update_userTitle_push:"+JSON.stringify(data));
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_update_usertitle,data);
        });
        //茶馆成员列表
        cc.vv.allRequest.addHandler("teaHouseMemberList_push",function(data)
        {
            console.log("teaHouseMemberList_push:"+JSON.stringify(data));
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_memberlist_push,data);
        });
        //茶馆公告消息
        cc.vv.allRequest.addHandler("teaHouseAnnounce_push",function(data){
            console.log('teaHouseAnnounce_push:' + JSON.stringify(data));
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_announce_push,data);
        });
        //申请列表
        cc.vv.allRequest.addHandler("request_list_push",function(data){
            console.log('request_list_push:' + JSON.stringify(data));
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_application_push,data);
        });
        //申请记录
        cc.vv.allRequest.addHandler("ThManageOpRecords_push",function(data){
            console.log('ThManageOpRecords_push:' + JSON.stringify(data));
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_applyrecord_push,data);
        });
        //茶馆老板处理申请回调
        cc.vv.allRequest.addHandler("operateJoinTHList_push",function(data){
            console.log('operateJoinTHList_push:' + JSON.stringify(data));
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_operateapplication_push,data);
        });
        //玩家退出
        cc.vv.allRequest.addHandler("teaHouse_member_exit",function(data){
            console.log('teaHouse_member_exit:' + JSON.stringify(data));
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_member_exit,data);
        });
        //管理员删除玩家
        cc.vv.allRequest.addHandler("teaHouse_member_remove",function(data){
            console.log('teaHouse_member_remove:' + JSON.stringify(data));
            //{adminName:管理员名称,removeUserName:被操作的玩家名称}
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_member_remove,data);
        });
        //管理员删除了自己
        cc.vv.allRequest.addHandler("member_been_removed",function(data){
            console.log('member_been_removed:' + JSON.stringify(data));
            //{adminName:管理员名称,removeUserName:被操作的玩家名称}
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_member_been_removed,data);
        });
        //用户加入茶馆
        cc.vv.allRequest.addHandler("teaHouse_member_enter",function(data){
            console.log('teaHouse_member_enter:' + JSON.stringify(data));
            cc.vv.GlobalMsg.Send("GameMgrMSG_Listen",cc.vv.GLGameDefine.MessageType.th_member_enter,data);
        });
        //teahouse-----------------------------teahouse-----------------------------teahouse------------------------------------------------------------end

    },
    RemoveLocalListener:function()
    {
    },
    onDestroy:function()
    {
        this.RemoveLocalListener();
    },
});
module.exports= new NetMgr();