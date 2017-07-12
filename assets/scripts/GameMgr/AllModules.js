//所有模块初始化
var AllModules = {};
module.exports = AllModules;

//消息类
AllModules.GlobalMsg = require("GlobalMsg");

AllModules.GLGameDataMgr=require("GLGameDataMgr");
//pomelo网络模块
AllModules.PomeloNetMgr=require("PomeloNetMgr");
//全局配置
AllModules.global = require("Global");
//网络,待优化整理
AllModules.allRequest = require("AllRequest");
//AllModules.net = require("Net");
//网络监听，消息分发
AllModules.NetMgr = require("NetMgr");
//音效
AllModules.audioMgr = require("AudioMgr");
//资源加载,本地和网络Net
AllModules.LoadLocResHandle = require("LoadLocResHandle");
//AllModules.LoadNetResHandle = require("LoadNetResHandUserMgrle");
//工具类
AllModules.utils = require("Utils");

//财产管理
AllModules.propertyMgr = require("propertyMgr");
//全局定义
AllModules.GLGameDefine = require("GLGameDefine");
//用户
//AllModules.userMgr = require("UserMgr");
AllModules.playerdata = require("playerdata");

//回放管理
//AllModules.replayMgr = require("ReplayMgr");
//跨平台相关代码
AllModules.anysdkMgr = require("AnysdkMgr");
//声音管理
//AllModules.voiceMgr = require("VoiceMgr");

AllModules.PoolMgr = require("PoolMgr");

AllModules.CusStorage = require("CusStorage");

///////////////////////////////////////////////////////////////////////////////////
//暂时保留，保证游戏正常测试
//后期替换掉
//AllModules.gameNetMgr = require("GameNetMgr");
//AllModules.thNetMgr = require("ThNetMgr");






