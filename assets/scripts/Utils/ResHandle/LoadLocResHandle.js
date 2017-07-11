//一个异步加载网络图片的类
//将要下载的网络链接传入，将链接加入到一个数组中，依次下载数组中的所有链接资源，并在下载完成后调用传入的函数
var LoadLocResHandle = cc.Class({
    extends: cc.Component,
    statics: {
        WaitList:null,
        DoneList:null,
        objList:null,
        KeyList:null,
        CurDownloadKey:null,
        IsUpdate:false,
        IntervalID:0,
        ResIndex:0,             //用于区别key，避免外部使用同一个key
    },
    
        init:function()
        {

            this.ResIndex = 1;
            this.WaitList={};
            this.DoneList=[];
            this.objList=[];

            this.KeyList=[];
            this.IsUpdate = false;
          

        },



        RemoveByValue:function(arr, val)
        {
            for(var i=0; i<arr.length; i++) 
            {  
                if(arr[i] == val) 
                {  
                    arr.splice(i, 1);  
                    break;  
                }  
            }  
       },
       //根据路径加载资源，加载完成后会调用回调函数
       //每次加载都会有特定的key值（尽量保证唯一，至少在同一时间加载的时候，不要出现重复）
       LoadByKey:function(key,url,callback)
       {
            this.KeyList.push(key);
            this.WaitList[key] = url;
            this.DoneList[key] = callback;

            this.CheckUpdate();
            console.log("LoadLocResHandle AddToList:"+key);
            console.log("LoadLocResHandle AddToList length:"+Object.keys(this.WaitList).length);
            console.log("LoadLocResHandle AddToList end length:"+Object.keys(this.WaitList).length);
       },
       //根据路径加载资源，加载完成后会调用回调函数
       //自动生成全局Key值，避免手动产生重复
       LoadByUrl:function(url,callback)
       {
            var key = "Reskey"+this.ResIndex;
            this.ResIndex++;
            console.log("LoadLocResHandle DownloadByUrl:"+key);
            //数据过大，重置
            if(this.ResIndex > 100000)
            {
                this.ResIndex=0;
            }

            this.KeyList.push(key);
            this.WaitList[key] = url;
            this.DoneList[key] = callback;

            this.CheckUpdate();
       },
       //加载并，添加到指定节点上
       LoadAndAdd:function(url,node)
       {
           this.LoadByUrl(url,function(err,obj,Key)
           {
               if(node == null || node == "undefined")
               {
                   console.log("node == null");
               }
               if(obj == null || obj == "undefined")
               {
                   console.log("LoadAndAdd obj == null");
               }
                node.addChild(cc.instantiate(obj));
           });
       },
       update:function()
       {
            cc.vv.LoadLocResHandle.IsUpdate = true;
            console.log("LoadLocResHandle update");
            cc.vv.LoadLocResHandle.DownloadRes();
       },
       DownloadRes:function()
       {
            if(Object.keys(this.WaitList).length <= 0)
            {
                if(this.CurDownloadKey == null || this.CurDownloadKey == "undefined")
                {
                    //关闭update
                    console.log("LoadLocResHandle update stop");
                    this.IsUpdate = false;
                    //this.unschedule(this.update);
                    clearInterval(this.update);
                }
                else
                {
                    //继续等待下载完成
                }
               
            }
            else//数组中要下载的列表还有
            {
                this.CheckUpdate();
                //当前下载的资源完成
                if(this.CurDownloadKey == null || this.CurDownloadKey == "undefined")
                {
                    this.CurDownloadKey = this.KeyList[0];//获取第一个key
                    console.log("LoadLocResHandle this.CurDownloadKey:"+this.CurDownloadKey);
                    console.log("LoadLocResHandle this.KeyList[0]:"+this.KeyList[0]);
                    var self = this;
                    console.log("LoadLocResHandle this.CurDownloadKey-url:"+this.WaitList[this.CurDownloadKey]);
                    var waitkey = self.CurDownloadKey;
                    cc.loader.loadRes(this.WaitList[this.CurDownloadKey], function (err, obj)
                    {
                        if(err == null)
                        {
                            //下载完成，
                            //删除KeyList中的key
                            console.log("LoadLocResHandle 下载完成，:"+self.CurDownloadKey);
                            self.RemoveByValue(self.KeyList,self.CurDownloadKey);//删除key
                            

                            if(self.objList[self.CurDownloadKey] != null && self.objList[self.CurDownloadKey] != "undefined")
                            {
                                console.log("LoadLocResHandle 下载完成，dlSpriteFrame:"+dlSpriteFrame);
                                self.objList[self.CurDownloadKey] = obj;
                                delete(self.objList[self.CurDownloadKey]);
                            }

                            //加载好的资源回调给传入的函数
                            if(self.DoneList[self.CurDownloadKey] != null && self.DoneList[self.CurDownloadKey] != "undefined")
                            {
                                console.log("LoadLocResHandle 下载完成，CurDownloadKey:"+err);
                                self.DoneList[self.CurDownloadKey](err,obj,self.CurDownloadKey);
                            }

                            //删除等待列表中的key
                            delete(self.WaitList[self.CurDownloadKey]);
                            delete(self.DoneList[self.CurDownloadKey]);
                            
                            //重置当前key
                            self.CurDownloadKey = null;
                            waitkey = null;
                            self.CheckUpdate();
                            
                        }
                    });
                    //5秒后，如果还未加载出来，证明有问题，停止加载，弹出错误
                    setTimeout(function() {
                        if(waitkey != null && waitkey == self.CurDownloadKey)
                        {
                            cc.error("self.CurDownloadKey:"+self.CurDownloadKey+" load failed!");
                            //删除等待列表中的key
                            delete(self.WaitList[self.CurDownloadKey]);
                            delete(self.DoneList[self.CurDownloadKey]);
                            
                            //重置当前key
                            self.CurDownloadKey = null;
                            waitkey = null;
                            self.CheckUpdate();
                        }
                    }, 5000);
                }
                else
                {
                    //当前下载的未完成，继续等待完成
                    
                }
            }
       },
       
       CheckUpdate:function()
       {
            console.log("LoadLocResHandle CheckUpdate this.IsUpdate:"+this.IsUpdate);
            if(this.IsUpdate == false)
            {
                console.log("LoadLocResHandle CheckUpdate this.IsUpdate = false:"+Object.keys(this.WaitList).length);
                if(Object.keys(this.WaitList).length > 0)
                {
                    console.log("LoadLocResHandle CheckUpdate IsUpdate = false :setInterval");
                    this.IntervalID = setInterval(this.update,100);
                    this.IsUpdate = true;
                    
                    return;
                }
                console.log("LoadLocResHandle CheckUpdate IsUpdate = false :clearInterval");
                this.IsUpdate = false;
                clearInterval(this.IntervalID);
            }
            else if(this.IsUpdate == true)
            {
                console.log("LoadLocResHandle CheckUpdate this.IsUpdate = true:"+Object.keys(this.WaitList).length);
                console.log("LoadLocResHandle CheckUpdate this.IsUpdate = true this.CurDownloadKey:"+this.CurDownloadKey);
                if(Object.keys(this.WaitList).length <= 0 && (this.CurDownloadKey == null || this.CurDownloadKey == "undefined"))
                {
                    console.log("LoadLocResHandle CheckUpdate IsUpdate = ture:clearInterval");
                    this.IsUpdate = false;
                    clearInterval(this.IntervalID);


                    console.log("LoadLocResHandle CheckUpdate WaitList length:"+Object.keys(this.WaitList).length);
                    console.log("LoadLocResHandle CheckUpdate DoneList length:"+Object.keys(this.DoneList).length);
                    console.log("LoadLocResHandle CheckUpdate DoneList length:"+Object.keys(this.objList).length);
                    
                    console.log("LoadLocResHandle CheckUpdate KeyList length:"+this.KeyList.length);
                    console.log("LoadLocResHandle CheckUpdate CurDownloadKey :"+this.CurDownloadKey);

                    return;
                }
            }
       },

   

    
});
module.exports = new LoadLocResHandle();