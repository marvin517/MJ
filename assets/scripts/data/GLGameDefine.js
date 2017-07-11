//本地游戏所数据
//路由---保证不同游戏在同一个对象中，确保不会重复
//本地消息-----全局唯一，保持在同一个对象中

//MessageType offset
var offset_th = 1000;                          //teahouse

var GLGameDefine = cc.Class({
    extends: cc.Component,
    statics: {
        //本地数据，拥有一个user对象
        //商品数据类

        //本地消息
        MessageType:{

            //public
            NetError:500,
            NetSucess:200,
            NetReLogin:400,

            initpomeloSucess:               100,    //
            initpomeloFailed:               101,    //
            gatequeryEntrySuc:              102,    //
            gatequeryEntryFail:             103,    //
            connectorSucess:                104,  
            connectorFailed:                105,

            queryEntrysucess:               201,    //链接服务器成功
            queryEntryfailed:               202,    //链接故武器失败
            checkversion:                   203,    //版本检测

            loginloginsuc:                  204,    //登陆成功
            Loginloginfailed:               205,    //登陆失败


            gameSceneCreate:                401,    //游戏场景创建--初始化
            roomRule:                       402,    //玩法显示
            SceneLoadFinish:                403,    //场景加载完成
            ButtonClick:                    404,
            createRoomSucess:               405,
            getRommInfo:                    406,

            userEnter:                      450,    //用户进入
            userLeave:                      451,    //用户退出
            userOnOffLine:                  452,    //用户上下线
            user_state_changed:             453,    //用户状态改变
            onHouseownerDissolve:           454,    //房主解散
            user_ready_push:                455,    //用户准备推送

            game_begin_push:                501,    //通知游戏开始
            game_holds_push:                502,    //手牌
            game_num_push:                  503,    //游戏第几局
            dissolve_notice_push:           504,    //通知玩家房间解散信息改变
            dissolve_cancel_push:           505,    //通知玩家房间解散被取消
            dissolve_success_push:          506,    //通知玩家房间解散成功

            singleHeadSpr_downloadOK:       600,    //通知玩家有个头像下载好了

            //teahouse
            th_fill_spreadercode_push:      offset_th + 1,  //散户加入茶馆里需要客户端发起填邀请码请求
            th_list_push:                   offset_th + 2,  //茶馆列表
            th_memberlist_push:             offset_th + 3,  //茶馆成员列表
            th_announce_push:               offset_th + 4,  //茶馆公告消息
            //operates_enter_teaHouse:        offset_th + 5,  //处理加入请求
            th_application_push:            offset_th + 6,  //茶馆的一条申请
            th_applyrecord_push:            offset_th + 7,  //茶馆的一条操作记录
            th_operateapplication_push:     offset_th + 8,  //茶馆老板处理申请回调
            th_member_exit:                 offset_th + 9,  //玩家退出
            th_member_remove:               offset_th + 10,  //玩家被管理员强制退出
            th_member_been_removed:         offset_th + 11,  //自己被强制退出
            th_member_enter:                offset_th + 12,  //玩家加入茶馆
            //th_exitteahouse_local:          offset_th + 13,  //退出了当前茶馆
            th_update_usertitle:            offset_th + 14,  //茶馆中玩家权限更新


            //lzmj
            user_trusteeship_push:          700,    //用户托管状态推送
            game_playing_push:              701,    //游戏运行
            game_dingque_push:              702,    //定缺
            game_huanpai_push:              703,    //换牌
            hangang_notify_push:            704,    //换杠
            game_action_push:               705,    //动作推送
            game_chupai_push:               706,    //出牌
            mj_count_push:                  707,    //麻将数量
            hu_push:                        708,    //胡牌
            game_chupai_notify_push:        709,
            game_mopai_push:                710,    //摸牌
            specially_tidy_holds_push:      711,    //
            guo_notify_push:                712,    //过通知
            guo_result:                     713,
            guohu_push:                     714,    //过胡
            huanpai_notify:                 715,    //换牌通知
            game_huanpai_over_push:         716,    //换牌结束
            peng_notify_push:               717,    //碰
            gang_notify_push:               718,    //杠
            game_dingque_notify_push:       719,    //定缺改变
            game_dingque_finish_push:       720,    //定缺结束
            voice_msg_push:                 721,    //语音、短语、自定义文本、表情都在此处监听
            voice_msg_pushs:                722,    //自定义文本聊天
            quick_chat_push:                723,    //短语
            emoji_push:                     724,    //表情
            specially_game_start_push:      725,    //开局动画
            onPurchasedItem:                726,    //物品发放
            game_start_perCardLeftNum_push: 727,
            Start_Time_Push:                728,
            game_over_push:                 729,    //游戏结束
            game_autofight:                 730,    //自动打缺
            game_autofightstate:            731,
            //lznn
            game_dingzhuang_push:           800,    //定庄
            game_qiangzhuang_begin_push:    801,    //开始抢庄
            game_qiangzhuang_notify_push:   802,    //有人抢庄
            game_qiangzhuang_finish_push:   803,    //抢庄结束
            game_xiazhu_begin_push:         804,    //通知准备下注
            game_xiaZhu_notify_push:        805,    //有人下注
            game_xiaZhu_finish_push:        806,    //下注结束
            game_liangpai_begin_push:       807,    //开始亮牌
            game_liangpai_notify_push:      808,    //有人亮牌
            game_liangpai_finish_push:      809,    //亮牌结束
            game_end_push:                  810,    //小结算
            game_big_end_push:              811,    //大结算
            game_holdsClicked:              812,    //手牌点击
            game_big_end_show:              813,    //大结算显示
            game_leave_NNGame:              814,    //退出牛牛游戏，重置牛牛数据
            


            // Gameready:                      600,	//准备
            // GameReconnection:               601,    //重连
            // Gamebet:                        602,    //下注
            // GameqiangZhuang:                603,    //抢庄结束
            // GameLiangpai:                   604,    //亮牌

            hall_refreshHeadTag:            1100,   //刷新头像标签
            hall_autoJoinTeahouse:          1101,   //自动进入茶馆
            game_hideInfo:                  1102,   //隐藏信息
            game_chupaiSucess:              1103,   //出牌成功
        },
        //按钮消息类型
        BTNMsgType:
        {
            login_Guestlogin:               "guestlogin",       //游客登陆
            login_wxlogin:                  "wxlogin",          //微信登陆

            hall_showshop:                  "showshop",         //显示商城消息
            hall_showinvate:                "showinvate",       //显示邀请界面
            hall_showhistory:               "showhistory",      //显示历史界面
            hall_showDeleget:               "showDeleget",      //显示代理界面
            hall_showsetting:               "showsetting",      //显示设置界面
            hall_showteahouse:              "showteahouse",     //显示茶馆
            hall_showluckwheel:             "showluckwheel",    //显示大转盘
            hall_showmail:                  "showmail",         //显示消息
            hall_showJoin:                  "showJoin",         //显示加入房间
            hall_showhelp:                  "showhelp",         //显示帮助
            hall_showpayroot:               "showpayroot",      //显示支付根节点
            hall_showshare:                 "showshare",        //分享节点
            //game
            game_showchat:                  "showchat",         //显示聊天界面
            game_showChatHistory:           "ChatHistory",      //
            game_changeDesk:                "btn_changeDesk",   //换桌布消息
            game_showgps:                   "showgps",          //换桌布消息

        },
        //游戏路由
        //前缀为场景名称
        //cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.HallgetRoomInfo,data);
        GameRoute:
        {
            "LoginqueryEntry"                   :"gate.gateHandler.queryEntry",
            "Loginlogin"                        :"connector.entryHandler.login",                            //登陆场景，登陆路由
            "HallenterGoldRoom"                 :"hall.roomHandler.enterGoldRoom",
            "HallgetGold"                       :"hall.hallHandler.getGold",
            "HallcreateRoom"                    :"hall.roomHandler.createRoom",
            "HallgetRoomInfo"                   :"game.roomHandler.getRoomInfo",
            //NN
            "Gameready"                         :"game.playerHandlerOfPoker.ready",                          //准备
            "GameReconnection"                  :"game.playerHandlerOfPoker.reconnection",            //重连
            "Gamebet"                           :"game.playerHandlerOfPoker.bet",                              //下注
            "GameqiangZhuang"                   :"game.playerHandlerOfPoker.qiangZhuang",              //抢庄结束
            "GameLiangpai"                      :"game.playerHandlerOfPoker.liangPai",                    //亮牌
            "GameChupai"                        :"game.playerHandler.chupai",
            "autofight"                         :"game.playerHandler.autofight",

			"hallenterTeaHouse"                 :"hall.teaHouseHandler.enterTeaHouse",
			"hallenterRoom"                     :"hall.roomHandler.enterRoom",
			"hallgetHistoryList"                :"hall.hallHandler.getHistoryList",
			"hallHiseach_room"                  :"hall.hallHandler.get_games_for_each_room",
			"hallSpreaderRewardInfo"            :"hall.hallHandler.getSpreaderRewardInfo",
			"hallget_room_card"                 :"hall.hallHandler.get_room_card",
			"hallplayerFeedbackCollect"         :"hall.hallHandler.playerFeedbackCollect",
			"hallgetTeaHouseList"               :"hall.teaHouseHandler.getTeaHouseList",
			"hallfillSpreaderCode"              :"hall.hallHandler.fillSpreaderCode",
			"hallkeepUserTel"                   :"hall.hallHandler.keepUserTel",
			"hallrunLuckyWheel"                 :"hall.hallHandler.runLuckyWheel",
			"hallgetPlayerLuckyWheelTimes"      :"hall.hallHandler.getPlayerLuckyWheelTimes",
			"hallfinishLuckyWheel"              :"hall.hallHandler.finishLuckyWheel",
			"hallLuckyWheelHistory"             :"hall.hallHandler.getLuckyWheelHistory",
			"hallEmailMessage"                  :"hall.hallHandler.getEmailMessage",
			"hallroom_card"                     :"hall.hallHandler.get_room_card",
			"hallcreateTeaHouse"                :"hall.teaHouseHandler.createTeaHouse",
			"hallgetUserList"                   :"hall.teaHouseHandler.getUserList",
			"halldeleteTeaHouseMember"          :"hall.teaHouseHandler.deleteTeaHouseMember",
			"hallchangeRight"                   :"hall.teaHouseHandler.changeRight",
			"hallchangeCredit"                  :"hall.teaHouseHandler.changeCredit",
			"hallexitTeaHouse"                  :"hall.teaHouseHandler.exitTeaHouse",
			"hallchangeTeaHouseAnnounce"        :"hall.teaHouseHandler.changeTeaHouseAnnounce",
			"halladdTeaRoomCard"                :"hall.teaHouseHandler.addTeaRoomCard",
			"hallgetTeaHouseHelp"               :"hall.teaHouseHandler.getTeaHouseHelp",
			"hallCreatedAndEnteredTeaHouses"    :"hall.teaHouseHandler.getCreatedAndEnteredTeaHouses",
			"hallgetTeaHouseData"               :"hall.teaHouseHandler.getTeaHouseData",
			"hallRequestEnterTeaHouseList"      :"hall.teaHouseHandler.getRequestEnterTeaHouseList",
			"hallgetTeaRoomRecord"              :"hall.teaHouseHandler.getTeaRoomRecord",
			"halldeleteTeaRoomHistory"          :"hall.teaHouseHandler.deleteTeaRoomHistory",
			"hallgetRequestList"                :"hall.teaHouseHandler.getRequestList",
			"halloperateRequst"                 :"hall.teaHouseHandler.operateRequst",
			"hallgetUserTHList"                 :"hall.teaHouseHandler.getUserTHList",
			"hallrequestCreateRoom"             :"hall.teaHouseHandler.requestCreateRoom",
			"hallchangeAllowFreeEnter"          :"hall.teaHouseHandler.changeAllowFreeEnter",
			
			"gamereconnection"                  :"game.playerHandler.reconnection",
			"gamegetRoomInfo"                   :"game.roomHandler.getRoomInfo",
			"gamevoiceMsg"                      :"game.playerHandler.voiceMsg",
			"gamevoiceMsgs"                     :"game.playerHandler.voiceMsgs",
			"gamedingque"                       :"game.playerHandler.dingque",
			"gameeedsDunLaPao"                  :"game.playerHandler.eedsDunLaPao",
			"gameautofight"                     :"game.playerHandler.autofight",
			"gamegang"                          :"game.playerHandler.gang",
			"gameeeds_chi"                      :"game.playerHandler.eeds_chi",
			"gamechupai"                        :"game.playerHandler.chupai",
			"gamepeng"                          :"game.playerHandler.peng",
			"gamehu"                            :"game.playerHandler.hu",
			"gameguo"                           :"game.playerHandler.guo",
			"gametemporarilyLeave"              :"game.roomHandler.temporarilyLeave",
			"gamedestroy"                       :"game.roomHandler.destroy",
			"gameexitRoom"                      :"game.roomHandler.exitRoom",
			"gameTrusteeship"                   :"game.playerHandler.Trusteeship",
			"gamedissolveAgree"                 :"game.playerHandler.dissolveAgree",
			"gamedissolveReject"                :"game.playerHandler.dissolveReject",
			"gamedissolveRequest"               :"game.playerHandler.dissolveRequest",
			"gameready"                         :"game.playerHandler.ready",
			"gamehuanpai"                       :"game.playerHandler.huanpai",
			
        },

        init:function()
        {

        },

    }
});
//module.exports = new GLGameDefine();


// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.LoginqueryEntry                   ,data);	{clientType : cc.vv.global.localClientType}
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.HallenterGoldRoom                 ,data);	var data = {ip: cc.vv.userMgr.ip,type:cc.vv.global.GameType.GoldsMJ,};
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.HallgetGold                       ,data);	var data = null;
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.Loginlogin                        ,data);	var data = {sign:1,os: cc.sys.os,account  : account,password : null,clientType: cc.vv.global.localClientType;clientVersion : cc.vv.global.version;upgradeVersion: cc.sys.localStorage.getItem("localVersion");};
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.HallcreateRoom                    ,data);	var data = {ip:cc.vv.userMgr.ip,conf:JSON.stringify(conf),la:la2,lo:lo2,};
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.HallgetRoomInfo                   ,data);	var data = {roomId: ret.data,userId: cc.vv.userMgr.userId};
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.Gameready                         ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.GameReconnection                  ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.Gamebet                           ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.GameqiangZhuang                   ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.GameLiangpai                      ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.GameChupai                        ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.autofight                         ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallenterTeaHouse                 ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallenterRoom                     ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallgetHistoryList                ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallHiseach_room                  ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallSpreaderRewardInfo            ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallget_room_card                 ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallplayerFeedbackCollect         ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallgetTeaHouseList               ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallfillSpreaderCode              ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallkeepUserTel                   ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallrunLuckyWheel                 ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallgetPlayerLuckyWheelTimes      ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallfinishLuckyWheel              ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallLuckyWheelHistory             ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallEmailMessage                  ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallroom_card                     ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallcreateTeaHouse                ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallgetUserList                   ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.halldeleteTeaHouseMember          ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallchangeRight                   ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallchangeCredit                  ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallexitTeaHouse                  ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallchangeTeaHouseAnnounce        ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.halladdTeaRoomCard                ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallgetTeaHouseHelp               ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallCreatedAndEnteredTeaHouses    ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallgetTeaHouseData               ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallRequestEnterTeaHouseList      ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallgetTeaRoomRecord              ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.halldeleteTeaRoomHistory          ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallgetRequestList                ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.halloperateRequst                 ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallgetUserTHList                 ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallrequestCreateRoom             ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.hallchangeAllowFreeEnter          ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamereconnection                  ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamegetRoomInfo                   ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamevoiceMsg                      ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamevoiceMsgs                     ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamedingque                       ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gameeedsDunLaPao                  ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gameautofight                     ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamegang                          ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gameeeds_chi                      ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamechupai                        ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamepeng                          ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamehu                            ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gameguo                           ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gametemporarilyLeave              ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamedestroy                       ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gameexitRoom                      ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gameTrusteeship                   ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamedissolveAgree                 ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamedissolveReject                ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamedissolveRequest               ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gameready                         ,data);
// cc.vv.NetMgr.NetRequest(cc.vv.GLGameDefine.GameRoute.gamehuanpai                       ,data);