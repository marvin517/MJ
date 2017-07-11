var GLGameDefine = require("GLGameDefine");
cc.Class({
    extends: cc.Component,

    properties: {
        MutilChcek:false,
        toggle: {
            default:[],
            type:[cc.Toggle]
        },
        checktype: {
            default: GLGameDefine.MessageType.CheckType_jushu,
            type: GLGameDefine.MessageType
        },
    },
    // use this for initialization
    onLoad: function () {
        try {
            for(var i = 0;i < this.toggle.length;i++)
            {
                this.toggle[i].node.on('toggle', this.callback, this);
            }
        } catch (error) {
            cc.error("RadioCheckMgr onLoad failed :"+JSON.stringify(error.message));
        }
    },

    callback: function (event) {
        try {
            //这里的 event 是一个 EventCustom 对象，你可以通过 event.detail 获取 Toggle 组件
            var toggle = event.detail;
            console.log("toggle:"+toggle.name);
            console.log("toggle:"+toggle.isChecked);
            var chooselist=[];
            //不是多选，互斥
            if(this.MutilChcek == false)
            {
                if(toggle.isChecked == true)
                {
                    for (var index = 0; index < this.toggle.length; index++) 
                    {
                        if(toggle == this.toggle[index])
                        {
                            console.log("toggle index:"+index);
                            
                        }
                        else
                        {
                            console.log("toggle other index:"+index);
                            this.toggle[index].isChecked=false;
                        }
                    }
                }
                else
                {
                    if(this.GetIsOneCheck() == false)
                    {
                        toggle.isChecked=true;
                    }
                }
            }
            else
            {
                for (var index = 0; index < this.toggle.length; index++) 
                {
                    if(toggle == this.toggle[index])
                    {
                        console.log("toggle index:"+index+","+this.toggle[index].isChecked);
                    }
                    else
                    {
                        console.log("toggle other index:"+index+","+this.toggle[index].isChecked);
                    }
                }
            }

            this.GetChooseData(chooselist);
            console.log("toggle chooselist:"+JSON.stringify(chooselist));
            cc.vv.GlobalMsg.SendMsg(this.checktype,chooselist);
        } catch (error) {
            cc.error("callback failed");
        }
    },
    //获取当前列表中选择的选项
    GetChooseData:function(list)
    {
        try {
            for (var index = 0; index < this.toggle.length; index++) 
            {
                list.push(this.toggle[index].isChecked);
            }

        } catch (error) {
            cc.error("GetChooseData failed");
        }
    },
    //检测是否有选择
    GetIsOneCheck:function()
    {
        try {
            for (var index = 0; index < this.toggle.length; index++) 
            {
                if(this.toggle[index].isChecked == true)
                {
                    return true;
                }
            }
            return false;
        } catch (error) {
            cc.error("GetIsOneCheck failed");
        }
        
    },
});
