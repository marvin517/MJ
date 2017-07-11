var GLGameDataMgr = cc.Class({
    properties: {

    },

    init:function()
    {
        //初始化其他类,扑克游戏相关数据
        cc.zcyx = {};
        
        this.RegisterMsg();
    },
    
    onDestroy:function()
    {
        this.UnRegisterMsg();
    },
    RegisterMsg:function()
    {
        cc.vv.GlobalMsg.Register("GameMgrMSG_Req_Cb", this.MssageHandle);
        cc.vv.GlobalMsg.Register("GameMgrMSG_Req_Cb_failed", this.MssageFailedHandle);
        cc.vv.GlobalMsg.Register("GameMgrMSG_Listen", this.MssageHandle_listen);
    },
    UnRegisterMsg:function()
    {
        cc.vv.GlobalMsg.Unregister("GameMgrMSG_Req_Cb", this.MssageHandle);
        cc.vv.GlobalMsg.Unregister("GameMgrMSG_Req_Cb_failed", this.MssageFailedHandle);
        cc.vv.GlobalMsg.Unregister("GameMgrMSG_Listen", this.MssageHandle_listen);
    },
    //失败回调
    //需要处理的比较少
    MssageFailedHandle:function(msgtype,parm)
    {
        console.log("msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.GameRoute.LoginqueryEntry:                          //登陆失败
            {
                console.log("parm:",parm);
                cc.vv.GlobalMsg.SendWithTarget("GameMgrLMSG",cc.vv.GLGameDefine.MessageType.queryEntryfailed,parm);
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.GameChupai:                          //登陆失败
            {
                console.log("parm:",parm);
                //cc.vv.alert.show("提示", "出牌失败，请检查网络状态是否良好！");
            }
            break;
        }
    },
    //listen----------------------------------------------------------------------------------------------linsen
    //监听本地消息，并处理
    //如果是数据类型或者单例类要接受的数据，直接调用函数
    //如果是某个界面类调用，则通过本地消息发送 :{}break;
    MssageHandle:function(msgtype,parm)
    {
        console.log("msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
        switch(msgtype)
        {
            case cc.vv.GLGameDefine.GameRoute.LoginqueryEntry:                          //登陆成功
            {
                console.log("msgtype:"+msgtype+","+"cc.vv.GLGameDefine.MessageType.connectGateSucess");
                //cc.vv.GlobalMsg.Send("GameMgrLMSG",cc.vv.GLGameDefine.MessageType.gatequeryEntrySuc,parm);
                cc.vv.GlobalMsg.SendMsg(cc.vv.GLGameDefine.MessageType.gatequeryEntrySuc,parm);
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.HallenterGoldRoom:
            {
                console.log("parm:",parm);
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.Loginlogin:
            {
                console.log("msgtype:"+msgtype+","+"cc.vv.GLGameDefine.GameRoute.Loginlogin:"+JSON.stringify(parm));
                cc.vv.GlobalMsg.SendMsg(cc.vv.GLGameDefine.MessageType.loginloginsuc,JSON.stringify(parm));
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.HallcreateRoom:
            {
                cc.vv.GlobalMsg.SendWithTarget("GameMgrLMSG",cc.vv.GLGameDefine.MessageType.createRoomSucess,parm);
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.HallgetRoomInfo:
            {
                cc.vv.GlobalMsg.SendWithTarget("GameMgrLMSG",cc.vv.GLGameDefine.MessageType.getRommInfo,parm);
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.GameReconnection:
            {   
                cc.pk.NNGameData.setRoomInfo(parm.roomInfo);
                cc.pk.NNGameData.setGameInfo(parm.gameInfo);
                // cc.vv.GlobalMsg.SendWithTarget("GameMgrLMSG",cc.vv.GLGameDefine.MessageType.GameReconnection,parm);
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.GameChupai:
            {
                //出牌成功，发送消息到本地游戏中：控制叫提示按钮的显示
                cc.vv.GlobalMsg.Send("GameMgrMSG",cc.vv.GLGameDefine.MessageType.game_chupaiSucess,parm);
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.autofight:
            {
                //出牌成功，发送消息到本地游戏中：控制叫提示按钮的显示
                cc.vv.GlobalMsg.Send("GameMgrMSG",cc.vv.GLGameDefine.MessageType.game_autofight,parm);
            }
            break;
           
            case cc.vv.GLGameDefine.GameRoute.HallgetGold                       :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.Gameready                         :
            {
            }
            break;

            case cc.vv.GLGameDefine.GameRoute.Gamebet                           :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.GameqiangZhuang                   :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.GameLiangpai                      :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallenterTeaHouse                 :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallenterRoom                     :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallgetHistoryList                :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallHiseach_room                  :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallSpreaderRewardInfo            :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallget_room_card                 :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallplayerFeedbackCollect         :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallgetTeaHouseList               :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallfillSpreaderCode              :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallkeepUserTel                   :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallrunLuckyWheel                 :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallgetPlayerLuckyWheelTimes      :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallfinishLuckyWheel              :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallLuckyWheelHistory             :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallEmailMessage                  :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallroom_card                     :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallcreateTeaHouse                :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallgetUserList                   :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.halldeleteTeaHouseMember          :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallchangeRight                   :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallchangeCredit                  :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallexitTeaHouse                  :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallchangeTeaHouseAnnounce        :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.halladdTeaRoomCard                :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallgetTeaHouseHelp               :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallCreatedAndEnteredTeaHouses    :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallgetTeaHouseData               :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallRequestEnterTeaHouseList      :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallgetTeaRoomRecord              :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.halldeleteTeaRoomHistory          :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallgetRequestList                :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.halloperateRequst                 :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallgetUserTHList                 :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallrequestCreateRoom             :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.hallchangeAllowFreeEnter          :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamereconnection                  :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamegetRoomInfo                   :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamevoiceMsg                      :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamevoiceMsgs                     :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamedingque                       :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gameeedsDunLaPao                  :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gameautofight                     :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamegang                          :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gameeeds_chi                      :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamechupai                        :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamepeng                          :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamehu                            :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gameguo                           :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gametemporarilyLeave              :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamedestroy                       :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gameexitRoom                      :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gameTrusteeship                   :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamedissolveAgree                 :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamedissolveReject                :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamedissolveRequest               :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gameready                         :
            {
            }
            break;
            case cc.vv.GLGameDefine.GameRoute.gamehuanpai                       :
            {
            }
            break;
            default:
            break;
        }
    },

    //监听网络信息后，存储数据，并转发给本地再处理
    MssageHandle_listen:function(msgtype,parm)
    {   
        console.log("msgtype:"+msgtype+","+"parm:"+JSON.stringify(parm));
        switch(msgtype)
        {
            //茶馆里需要客户端发起填邀请码请求
            case cc.vv.GLGameDefine.MessageType.th_fill_spreadercode_push:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_fill_spreadercode_push,parm);              
            }break;
            //茶馆列表
            case cc.vv.GLGameDefine.MessageType.th_list_push:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_list_push,parm);              
            }break;
            //茶馆中玩家权限更新
            case cc.vv.GLGameDefine.MessageType.th_update_usertitle:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_update_usertitle,parm);              
            }break;
            //茶馆成员列表
            case cc.vv.GLGameDefine.MessageType.th_memberlist_push:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_memberlist_push,parm);              
            }break;
            //茶馆公告消息
            case cc.vv.GLGameDefine.MessageType.th_announce_push:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_announce_push,parm);              
            }break;
            //申请列表
            case cc.vv.GLGameDefine.MessageType.th_application_push:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_application_push,parm);              
            }break;
            //申请记录
            case cc.vv.GLGameDefine.MessageType.th_applyrecord_push:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_applyrecord_push,parm);              
            }break;
            //茶馆老板处理申请回调
            case cc.vv.GLGameDefine.MessageType.th_operateapplication_push:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_operateapplication_push,parm);              
            }break;
            //玩家退出
            case cc.vv.GLGameDefine.MessageType.th_member_exit:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_member_exit,parm);              
            }break;
            //管理员删除玩家
            case cc.vv.GLGameDefine.MessageType.th_member_remove:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_member_remove,parm);              
            }break;
            //管理员删除了自己
            case cc.vv.GLGameDefine.MessageType.th_member_been_removed:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_member_been_removed,parm);
            }break;
            //用户加入茶馆
            case cc.vv.GLGameDefine.MessageType.th_member_enter:                    
            {
                cc.vv.GlobalMsg.SendWithTarget("GLGameDataMgrLMSG",cc.vv.GLGameDefine.MessageType.th_member_enter,parm);         
            }break;



            default:
            break;
        }
    },

});
module.exports = new GLGameDataMgr();