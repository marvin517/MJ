//一个异步加载网络图片的类
//将要下载的网络链接传入，将链接加入到一个数组中，依次下载数组中的所有链接资源，并在下载完成后调用传入的函数
var LoadNetResHandle = cc.Class({
    extends: cc.Component,
    statics: {
        WaitList:null,
        DoneList:null,
        spriteList:null,
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
            this.spriteList=[];

            this.KeyList=[];
            this.IsUpdate = false;
            
            // this.KeyList.push("ss");
            // this.KeyList.push("ss1");
            // this.KeyList.push("ss2");
            // console.log("LoadNetResHandle KeyList:"+this.KeyList.length);
            // for(var i = 0;i < this.KeyList.length;i++)
            // {
            //     console.log("LoadNetResHandle KeyList[]:"+this.KeyList[i]);
            // }
            // this.removeByValue(this.KeyList,"ss2"); 

            // console.log("LoadNetResHandle removeByValue KeyList:"+this.KeyList.length);
            // for(var i = 0;i < this.KeyList.length;i++)
            // {
            //     console.log("LoadNetResHandle removeByValue KeyList[]:"+this.KeyList[i]);
            // }

            // this.WaitList["ss"] = "http://wx.qlogo.cn/mmopen/jXm6cuBsGEUwmZiaT7nibvOicgAKXHz2Sd1HHG6ib8ZL0jDxM7Kuh8ZJOC6EOJFnibkQcERe7KVoT6vCm3pSeib8ibyibtUh4Vcz4PHR/0.jpg";
            // this.WaitList["ss1"] = "http://wx.qlogo.cn/mmopen/ajNVdqHZLLD1Wj1RlyV90cxjYEydrmWOKzCX8Licxxmnwn3BHvDBQnNzU5Aia3icswxSVJP0wM20XYiap1G48Sx5oQ/0.jpg";
            // this.WaitList["ss2"] = "http://wx.qlogo.cn/mmopen/ajNVdqHZLLC9BAe0b9SfIMIvGP5SN7pOnr9OOGM392RBUXKD13icjYIoZfOq7RJ0zblM5Oicmeic5uNYLWkM2xDwA/0.jpg";

            //this.IntervalID = setInterval(this.update,1000);


            // this.AddToList("ss","http://wx.qlogo.cn/mmopen/jXm6cuBsGEUwmZiaT7nibvOicgAKXHz2Sd1HHG6ib8ZL0jDxM7Kuh8ZJOC6EOJFnibkQcERe7KVoT6vCm3pSeib8ibyibtUh4Vcz4PHR/0.jpg",this.testcallback);
            // this.AddToList("ss1","http://wx.qlogo.cn/mmopen/ajNVdqHZLLD1Wj1RlyV90cxjYEydrmWOKzCX8Licxxmnwn3BHvDBQnNzU5Aia3icswxSVJP0wM20XYiap1G48Sx5oQ/0.jpg",this.testcallback);
            // this.AddToList("ss2","http://wx.qlogo.cn/mmopen/ajNVdqHZLLC9BAe0b9SfIMIvGP5SN7pOnr9OOGM392RBUXKD13icjYIoZfOq7RJ0zblM5Oicmeic5uNYLWkM2xDwA/0.jpg",this.testcallback);
            // console.log("LoadNetResHandle AddToList WaitList:"+this.WaitList.length);
            // console.log("LoadNetResHandle AddToList delete ss length:"+Object.keys(this.WaitList).length);

        },
        testcallback:function(err,image)
        {
            console.log("LoadNetResHandle testcallback:"+image);
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
       DownloadByKey:function(key,url,callback)
       {
            this.KeyList.push(key);
            this.WaitList[key] = url;
            this.DoneList[key] = callback;

            this.CheckUpdate();
            console.log("LoadNetResHandle AddToList:"+key);
            console.log("LoadNetResHandle AddToList length:"+Object.keys(this.WaitList).length);
            console.log("LoadNetResHandle AddToList end length:"+Object.keys(this.WaitList).length);
       },

       DownloadByUrl:function(url,callback)
       {
            var key = "Reskey"+this.ResIndex;
            this.ResIndex++;
            console.log("LoadNetResHandle DownloadByUrl:"+key);
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
       DownloadByUrlSF:function(_sprite,url,callback)
       {
            var key = "Reskey"+this.ResIndex;
            this.ResIndex++;
            //数据过大，重置
            if(this.ResIndex > 100000)
            {
                this.ResIndex=0;
            }
            
            this.KeyList.push(key);
            this.WaitList[key] = url;
            this.DoneList[key] = callback;
            this.spriteList[key]=_sprite;
            this.CheckUpdate();

       },

       update:function()
       {
            cc.vv.LoadNetResHandle.IsUpdate = true;
            console.log("LoadNetResHandle update+");
            cc.vv.LoadNetResHandle.DownloadRes();
       },
       DownloadRes:function()
       {
            if(Object.keys(this.WaitList).length <= 0)
            {
                if(this.CurDownloadKey == null || this.CurDownloadKey == "undefined")
                {
                    //关闭update
                    console.log("LoadNetResHandle update stop");
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
                    console.log("LoadNetResHandle this.CurDownloadKey:"+this.CurDownloadKey);
                    console.log("LoadNetResHandle this.KeyList[0]:"+this.KeyList[0]);
                    var self = this;
                    console.log("LoadNetResHandle this.CurDownloadKey-url:"+this.WaitList[this.CurDownloadKey]);
                    cc.loader.load(this.WaitList[this.CurDownloadKey], function (err, tex)
                    {
                        if(err == null)
                        {
                            //下载完成，
                            //删除KeyList中的key
                            console.log("LoadNetResHandle 下载完成，:"+self.CurDownloadKey);
                            self.RemoveByValue(self.KeyList,self.CurDownloadKey);//删除key
                            
                            var dlSpriteFrame =  new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                            if(self.spriteList[self.CurDownloadKey] != null && self.spriteList[self.CurDownloadKey] != "undefined")
                            {
                                console.log("LoadNetResHandle 下载完成，dlSpriteFrame:"+dlSpriteFrame);
                                self.spriteList[self.CurDownloadKey].SpriteFrame = dlSpriteFrame;//设置资源，然后删除
                                delete(self.spriteList[self.CurDownloadKey]);
                            }

                            //将下载好的图片回调给传入的函数
                            if(self.DoneList[self.CurDownloadKey] != null && self.DoneList[self.CurDownloadKey] != "undefined")
                            {
                                console.log("LoadNetResHandle 下载完成，CurDownloadKey:"+err);
                                self.DoneList[self.CurDownloadKey](err,dlSpriteFrame,self.CurDownloadKey);
                            }

                            //删除等待列表中的key
                            delete(self.WaitList[self.CurDownloadKey]);
                            delete(self.DoneList[self.CurDownloadKey]);
                            
                            //重置当前key
                            self.CurDownloadKey = null;
                            self.CheckUpdate();
                            
                        }
                    });
                }
                else
                {
                    //当前下载的未完成，继续等待完成
                    
                }
            }
       },
       
       CheckUpdate:function()
       {
            console.log("LoadNetResHandle CheckUpdate this.IsUpdate:"+this.IsUpdate);
            if(this.IsUpdate == false)
            {
                console.log("LoadNetResHandle this.IsUpdate = false:"+Object.keys(this.WaitList).length);
                if(Object.keys(this.WaitList).length > 0)
                {
                    console.log("LoadNetResHandle CheckUpdate IsUpdate = false :setInterval");
                    this.IntervalID = setInterval(this.update,1000);
                    this.IsUpdate = true;
                    
                    return;
                }
                console.log("LoadNetResHandle CheckUpdate IsUpdate = false :clearInterval");
                this.IsUpdate = false;
                clearInterval(this.IntervalID);
            }
            else if(this.IsUpdate == true)
            {
                console.log("LoadNetResHandle this.IsUpdate = true:"+Object.keys(this.WaitList).length);
                console.log("LoadNetResHandle this.IsUpdate = true this.CurDownloadKey:"+this.CurDownloadKey);
                if(Object.keys(this.WaitList).length <= 0 && (this.CurDownloadKey == null || this.CurDownloadKey == "undefined"))
                {
                    console.log("LoadNetResHandle CheckUpdate IsUpdate = ture:clearInterval");
                    this.IsUpdate = false;
                    clearInterval(this.IntervalID);


                    console.log("LoadNetResHandle CheckUpdate WaitList length:"+Object.keys(this.WaitList).length);
                    console.log("LoadNetResHandle CheckUpdate DoneList length:"+Object.keys(this.DoneList).length);
                    console.log("LoadNetResHandle CheckUpdate DoneList length:"+Object.keys(this.spriteList).length);
                    
                    console.log("LoadNetResHandle CheckUpdate KeyList length:"+this.KeyList.length);
                    console.log("LoadNetResHandle CheckUpdate CurDownloadKey :"+this.CurDownloadKey);

                    return;
                }
            }
       },

   

    
});
module.exports = new LoadNetResHandle();