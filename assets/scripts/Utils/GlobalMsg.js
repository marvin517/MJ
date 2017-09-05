var GlobalMsg = cc.Class({
    extends: cc.Component,

    statics:
     {
        m_Callbacks:[],             //回调函数
        m_targetCallbacks:[],
        m_targetList:[],            //目标函数回调节点列表

        m_ObserverList:[],
        m_ObserverDelList:[],
        m_SendMsgDone:true,
    },

    init:function()
    {
        this.m_Callbacks = [];
        this.m_targetCallbacks = [];
        this.m_targetList = [];
        this.m_ObserverList=[];
        this.m_ObserverDelList=[];
        this.m_SendMsgDone=true;
    },

    //多参数调用，
    //第一个参数为消息key值
    //第二个参数为回调函数
    //第三个参数回调节点
    RegisterMul:function()
    {
        console.log("arguments.length:"+arguments.length);
        var args = arguments;
        for(var i = 0;i < args.length;i++)
        {
            var value = args[i];
            console.log("value:"+value);

            //第一个参数，必需是消息key，否则，注册失败
            if(typeof value == 'string' && i == 0)
            {
                //初始化消息数组
                if(this.m_targetCallbacks[value] == null)
                {
                    this.m_targetCallbacks[value]=[];
                }
            }
            else
            {
                cc.error("RegisterMul failed ,case first arg is not key for the message!");
            }

            //第二个参数，必需是消息回调函数，否则，注册失败
            if(typeof value == 'function' && i == 1)
            {
                this.m_targetCallbacks[msgkey].push(value);
            }
            else
            {
                cc.error("RegisterMul failed ,case second arg is not function for the message!");
            }
             //第三个参数，必需是消息回调函数，否则，注册失败
             console.log("number value:"+typeof(value));
            if(/*typeof value == 'function' && */i == 3)
            {
                this.m_targetList[msgkey].push(value);
            }
            else
            {
                cc.error("RegisterMul failed ,case second arg is not function for the message!");
            }

            // if(typeof value == 'number')
            // {
            //     console.log("number value:"+value);
            // }
            // else if(typeof value == 'string')
            // {
            //     console.log("string value:"+value);
            // }
            // else if(typeof value == 'object')
            // {
            //     console.log("object value:"+value);
            // }
            // else
            // {
            //     console.log("else typeof value:"+typeof(value));
            // }
        }
        //typeof (args) == "function"  number  undefined   object    string  
    },
    
  
    Register:function(msgkey,callback)
    {
        if(this.m_Callbacks[msgkey] == null)
        {
            this.m_Callbacks[msgkey]=[];
        }
        this.m_Callbacks[msgkey].push(callback);   //二维数组，同一个脚本，可能注册多次
    },
    Unregister:function(msgkey,callback)
    {
        if(this.m_Callbacks[msgkey] == null)
        {
            console.log("Unregister "+msgkey+" failed! case it is null!");
        }

        this.m_Callbacks[msgkey].forEach(function(value,index,array)
        {
            if(callback == value)
            {
                array.splice(index, 1);
            }
        });
    },
    
    Send:function(msgkey)
    {
        if(this.m_Callbacks[msgkey] == null)
        {
            cc.warn("this.m_Callbacks[msgkey] == null:"+msgkey);
            return;
        }

        var args = arguments;
        if(args < 1)
        {
            cc.error("Send failed! arg is null");
            return;
        }
        msgkey = args[0];
        //第一个参数，必需是消息key
        if(typeof args[0] == 'string')
        {
            //初始化消息数组
            if(this.m_Callbacks[args[0]] == null)
            {
                cc.error("Send failed!,function has not register!");
            }
        }
        else
        {
            cc.error("Send failed ,case first arg is not key for the message!");
        }

        if(this.m_Callbacks[msgkey] == null || this.m_Callbacks[msgkey] == undefined)
        {
            cc.error("Send failed!,function has not register!");
            return;
        }


        switch(args.length)
        {
            case 1:
            {
                this.m_Callbacks[msgkey].forEach(function(value,index,array)
                {
                    value();
                });
            }
            break;
            case 2:
            {
                this.m_Callbacks[msgkey].forEach(function(value,index,array)
                {
                    value(args[1]);
                });
            }
            break;
            case 3:
            {
                this.m_Callbacks[msgkey].forEach(function(value,index,array)
                {
                    value(args[1],args[2]);
                });
            }
            break;
            case 4:
            {
                this.m_Callbacks[msgkey].forEach(function(value,index,array)
                {
                    value(args[1],args[2],args[3]);
                });
            }
            break;
            default:
            break;
        }
    },
    SendByReturn:function(msgkey,data)
    {
        this.m_Callbacks[msgkey].forEach(function(value,index,array)
        {
            return value(data);
        });
    },
    ////////////////////////////////////////////////////////////////////////////////////
    //指定目标
    RegisterWithTarget:function(msgkey,callback,node)
    {
        if(this.m_targetCallbacks[msgkey] == null || this.m_targetCallbacks[msgkey] == undefined)
        {
            this.m_targetCallbacks[msgkey]=[];
        }
        this.m_targetCallbacks[msgkey].push(callback);
        
        if(this.m_targetList[msgkey] == null)
        {
            this.m_targetList[msgkey]=[];
        }
        this.m_targetList[msgkey].push(node);
    },
    SendWithTarget:function()
    {
       var args = arguments;
        if(args < 1)
        {
            cc.error("Send failed! arg is null");
            return;
        }
        var msgkey = args[0];
        //第一个参数，必需是消息key
        if(typeof args[0] == 'string')
        {
            //初始化消息数组
            if(this.m_targetCallbacks[args[0]] == null)
            {
                cc.error("Send failed!,function has not register!");
            }
        }
        else
        {
            cc.error("Send failed ,case first arg is not key for the message!");
        }
        var self = this;

        if(this.m_targetCallbacks[msgkey] == null || this.m_targetCallbacks[msgkey] == undefined)
        {
            cc.error("Send failed!,function has not register!");
            return;
        }

        switch(args.length)
        {
            case 1:
            {
                
                this.m_targetCallbacks[msgkey].forEach(function(value,index,array)
                {
                    self.m_targetList[msgkey].forEach(function(node,nodeindex,nodearray)
                    {
                        if(index == nodeindex)
                        {
                            value(node);
                        }
                    });
                    
                });
            }
            break;
            case 2:
            {
                this.m_targetCallbacks[msgkey].forEach(function(value,index,array)
                {
                    self.m_targetList[msgkey].forEach(function(node,nodeindex,nodearray)
                    {
                        if(index == nodeindex)
                        {
                            value(node,args[1]);
                        }
                    });
                });
            }
            break;
            case 3:
            {
                this.m_targetCallbacks[msgkey].forEach(function(value,index,array)
                {
                    self.m_targetList[msgkey].forEach(function(node,nodeindex,nodearray)
                    {
                        if(index == nodeindex)
                        {
                            value(node,args[1],args[2]);
                        }
                    });
                });
            }
            break;
            case 4:
            {
                this.m_targetCallbacks[msgkey].forEach(function(value,index,array)
                {
                    self.m_targetList[msgkey].forEach(function(node,nodeindex,nodearray)
                    {
                        if(index == nodeindex)
                        {
                            value(node,args[1],args[2],args[3]);
                        }
                    });
                });
            }
            break;
            default:
            break;
        }
    },
    UnregisterWithTarget:function(msgkey,callback,node)
    {
        //删除函数
        if(this.m_targetCallbacks[msgkey] == null)
        {
            console.log("Unregister "+msgkey+" failed! case it is null!");
        }

        this.m_targetCallbacks[msgkey].forEach(function(value,index,array)
        {
            if(callback == value)
            {
                array.splice(index, 1);
            }
        });

        //删除节点
        if(this.m_targetList[msgkey] == null)
        {
            console.log("Unregister "+msgkey+" failed! case it is null!");
        }

        this.m_targetList[msgkey].forEach(function(value,index,array)
        {
            if(node == value)
            {
                array.splice(index, 1);
            }
        });
    },
////////////////////////////////////////////////////////////////////////////////////////
//依赖于对象的唯一性
//添加监听
    AddObserver:function(obj)
    {
        this.m_ObserverList.forEach((item, index) => 
        {
            if (item === obj) {
                return true;
            }
        });

        if (obj) {
            this.m_ObserverList.push(obj);
        } else {
            cc.warn("ERR: invalid addObserver obj:"+obj);
            return false;
        }
        return true;
        
    },
    //发送消息
    SendMsg:function(msgtype,parm)
    {
        try {
            this.m_SendMsgDone = false;
            if(!this.m_ObserverList)
            {
                cc.warn("obj list is empty!");
            }

            for(var i = 0;i < this.m_ObserverList.length;i++)
            {
                if(this.m_ObserverList[i])
                {
                    this.m_ObserverList[i].MssageHandle(msgtype,parm);
                }
                else
                {
                    cc.warn("");
                }
            }
            this.m_SendMsgDone = true;
            this.CheckAllObj();
        } catch (error) {
            cc.error("function dose not exsist");
        }
        
    },
    //删除消息
    RemoveObserver:function(obj)
    {
        try {
            this.m_ObserverDelList.forEach((item, index) => 
            {
                if (item === obj) {
                    return false;
                }
            });
            
            if(obj)
            {
                if(this.m_ObserverDelList)
                {
                    this.m_ObserverDelList.push(obj);
                    this.CheckAllObj();
                    return true;
                }
            }
        } catch (error) {
            cc.vv.global.ShowErrorMsg("RemoveObserver Failed:"+JSON.stringify(error.message));
        }
        return false;
    },
    CheckAllObj:function()
    {
        try {
            if(this.m_SendMsgDone == true)
            {
                console.log("remove obj handle");
                for (var index = 0; index < this.m_ObserverDelList.length; index++) {
                    for(var i = 0;i < this.m_ObserverList.length;i++)
                    {
                        if(this.m_ObserverList[i] == this.m_ObserverDelList[index])
                        {
                            console.log("remove obj handle  s ");
                            this.m_ObserverList.splice(i, 1);
                            this.m_ObserverDelList.splice(index, 1);
                            this.CheckAllObj();
                            return;
                        }
                    }
                    //如果没找到一致的，需要删除列表中的对象
                    this.m_ObserverDelList.splice(index, 1);
                    this.CheckAllObj();
                    return;
                }
                return;
            }
            return;
        } catch (error) {
            
        }
        
    },
    













});
module.exports = new GlobalMsg();