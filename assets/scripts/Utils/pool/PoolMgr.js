
var PoolMgr = cc.Class({
    extends: cc.Component,

    properties: {
        AllNode:null,               //存放所有节点

    },

    init:function()
    {
        console.log("PoolMgr init");
        this.AllNode = [];
        this.LoadAllBuconfig();
    },
    LoadAllBuconfig:function()
    {
        console.log("PoolMgr LoadAllBuconfig");
        this.LoadAllByKey("TestPoolNode",5);
    },
    LoadAllByKey:function(cfgKey,count)
    {
        var self = this;
        console.log("PoolMgr LoadAllByKey:"+JSON.stringify(cfgKey));
        cc.vv.LoadLocResHandle.LoadByKey(cfgKey,"prefabs/TestPoolNode",function(err,obj,Key)
        {
            console.log("PoolMgr LoadAllByKey LoadByKey");
            //obj.getComponent("BaseNode").init();
            if(cfgKey == Key)
            {
                if(self.AllNode[Key] == null)
                {
                    self.AllNode[Key]=[];
                }
                for(var i = 0;i < count;i++)
                {
                    var pre = cc.instantiate(obj);
                    if(pre.getComponent("BaseNode") != null ||pre.getComponent("BaseNode") != undefined)
                    {
                        pre.getComponent("BaseNode").init();
                        pre.getComponent("BaseNode").index = i;
                        cc.log("self.AllNode[Key].push(pre)");
                        self.AllNode[Key].push(pre);
                    }
                    else
                    {
                        cc.error("LoadByKey failed !");
                        return;
                    }
                }
            }
        });
    },
    GetPrefab:function(key)
    {
        cc.log("GetPrefab:"+key);
        cc.log("GetPrefab this.AllNode[key].length:"+this.AllNode[key].length);
        if(this.AllNode[key] == null || this.AllNode[key].length == 0)
        {
            //指定的key节点不存在,或者数量不足，查询配置表，然后加载指定数量的节点到内存池
            cc.log("GetPrefab this.AllNode[key] == null");
            this.addPrefabTopool(key);
        }
        else
        {
            var nodearr = this.AllNode[key];

            for(var i = 0;i < nodearr.length;i++)
            {
                var node = nodearr[i];
                if(node == null)
                {
                    cc.log("node == null");
                }
                if(node.getComponent("BaseNode") == null)
                {
                    cc.log("this.addChild(node) getComponent null");
                }
                var state = node.getComponent("BaseNode").getState();
                cc.log("GetPrefab state!:"+state);
                if(state == 0 || state == -1)
                {
                    cc.log("GetPrefab sucess!:"+node.getComponent("BaseNode").index);
                    node.getComponent("BaseNode").setState(1);
                    return node;
                }
                else
                {
                    
                    //可用节点数量不足，继续生成，然后在然后一个可用节点
                }
                
            }
            cc.log("this.addChild(node) getComponent 数量不足");
            this.addPrefabTopool(key);
        }
    },
    Clear:function()
    {

    },
    //删除内存池中的对象
    //key：对应的预制
    //count:-1：所有
    RemovePrefab:function(key,count)
    {
        
    },



    //内部函数
    //当预制不足的时候，添加到内存池中，每次添加指定数量count,配置表中递增数量
    addPrefabTopool:function(key)
    {
        this.LoadAllByKey(key,2);//配置表中的递增数量
    },
});
module.exports= new PoolMgr();